//בס"ד
import { useEffect, useMemo, useRef, useState, type FC, type JSX } from "react";
import {
  compareMatches,
  createSimpleMatch,
  isMatchesSame,
  manualRowsToScheduleSlots,
  mergeSchedulePreferManual,
  tbaMatchToRegularMatch,
  type Alliance,
  type ManualSchedulesByCompetition,
  type Match,
  type SimpleTBAMatch,
  type TBAMatches2026,
  type TBAMatchesProps,
} from "@repo/scouting_types";
import type { TabProps } from "../ScoutMatch";
import { useLocalStorage } from "@repo/local_storage_hook";

const MATCH_NUMBER_MAX = 127;

export const fetchGameMatches = async <TBAMatches = unknown,>(
  event: string,
  maxMatch: Match,
): Promise<TBAMatches> => {
  const response = await fetch("/api/v1/tba/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, maxMatch } satisfies TBAMatchesProps),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Server Error (${response.status}): ${text}`);
  }

  const { matches } = JSON.parse(text);
  return matches;
};

const initialLocation = ["close", "middle", "far"] as const;
type InitialLocation = (typeof initialLocation)[number];

interface RobotPositionInfo {
  alliance: Alliance;
  location: InitialLocation;
}

interface MatchQualWithTeamNumberProps {
  match: Match;
  alliance: Alliance;
  initialLocation: InitialLocation;
}

type MatchTeams = {
  blueAlliance: number[];
  redAlliance: number[];
  match: Match;
};

const toTeamNum = (k: string) => Number(k.replace("frc", ""));

const toQualMatches = (matches: SimpleTBAMatch[]): MatchTeams[] =>
  matches
    .map((tbaMatch) => ({
      match: tbaMatchToRegularMatch(tbaMatch),
      blueAlliance: tbaMatch.alliances.blue.team_keys.map(toTeamNum),
      redAlliance: tbaMatch.alliances.red.team_keys.map(toTeamNum),
    }))
    .sort((tbaMatch1, tbaMatch2) =>
      compareMatches(tbaMatch1.match, tbaMatch2.match),
    );

const matchMatchWithTeamNumber = (
  props: MatchQualWithTeamNumberProps,
  allTBAMatches: MatchTeams[],
): number => {
  const DEFAULT_TEAM_NUMBER = 0;

  const tbaMatch = allTBAMatches.find((tbaMatch) =>
    isMatchesSame(tbaMatch.match, props.match),
  );
  if (!tbaMatch) return DEFAULT_TEAM_NUMBER;

  const allianceArr =
    props.alliance === "blue" ? tbaMatch.blueAlliance : tbaMatch.redAlliance;

  const index =
    props.initialLocation === "close"
      ? 0
      : props.initialLocation === "middle"
        ? 1
        : 2;

  return allianceArr[index] ?? DEFAULT_TEAM_NUMBER;
};

const MATCH_ADJUSTMENT_OFFSET = 1;
const PreMatchTab: FC<TabProps> = ({
  currentForm: form,
  setForm,
  setAlliance,
}) => {
  const [robotPositionInfo, setRobotPositionInfo] =
    useLocalStorage<RobotPositionInfo>("robotPositionInfo", {
      alliance: "red",
      location: "close",
    });
  const [tbaMatches, setTbaMatches] = useState<SimpleTBAMatch[]>([]);
  const [manualSchedulesByCompetition] =
    useLocalStorage<ManualSchedulesByCompetition>(
      "manualMatchScheduleByCompetition",
      {},
    );
  const [match, setMatch] = useState(form.match);
  const userPickedTeamNumberRef = useRef(false);

  // const updateTBAMatches = async () => {

  //   try {
  //     const newTBAMatches = await fetchGameMatches<SimpleTBAMatch>(
  //       form.competition,
  //       match,
  //     );
  //     setTbaMatches(newTBAMatches);
  //   } catch {
  //     /* keep cached TBA matches; manual schedule still applies */
  //   }
  // };

  const applyMatchUpdate = (next: Match) => {
    userPickedTeamNumberRef.current = false;
    setMatch(next);
  };

  const mergedSlots = useMemo(() => {
    const manualRows = manualSchedulesByCompetition[form.competition] ?? [];
    const manualSlots = manualRowsToScheduleSlots(manualRows);
    const tbaSlots = toQualMatches(tbaMatches);
    return mergeSchedulePreferManual(tbaSlots, manualSlots);
  }, [tbaMatches, manualSchedulesByCompetition, form.competition]);

  useEffect(() => {
    setAlliance(robotPositionInfo.alliance);
  }, [robotPositionInfo]);

  useEffect(() => {
    const newTeam = matchMatchWithTeamNumber(
      {
        match: match,
        alliance: robotPositionInfo.alliance,
        initialLocation: robotPositionInfo.location,
      },
      mergedSlots,
    );

    setForm((prev) => ({
      ...prev,
      teamNumber: userPickedTeamNumberRef.current ? prev.teamNumber : newTeam,
      match,
    }));
  }, [mergedSlots, match, robotPositionInfo]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3  mx-auto">
      <InputBox name="Scouter Name">
        <input
          type="text"
          className="w-85 h-full"
          defaultValue={form.scouterName}
          onChange={(event) => {
            setForm((prev) => ({
              ...prev,
              scouterName: event.target.value,
            }));
          }}
        />
      </InputBox>
      <InputBox name="Match Number">
        <>
          <input
            type="number"
            className="w-43.75 h-full"
            max={MATCH_NUMBER_MAX}
            value={match.number === 0 ? undefined : match.number}
            onChange={(event) => {
              applyMatchUpdate({
                ...match,
                number: Number(event.target.value),
              });
            }}
          />
          <button
            className="w-20 h-full"
            onClick={() => {
              applyMatchUpdate({
                ...match,
                number: match.number + MATCH_ADJUSTMENT_OFFSET,
              });
            }}
          >
            +
          </button>
          <button
            className="w-20 h-full"
            onClick={() => {
              applyMatchUpdate({
                ...match,
                number: Math.max(match.number - MATCH_ADJUSTMENT_OFFSET, 0),
              });
            }}
          >
            -
          </button>
        </>
      </InputBox>

      <InputBox name="Match Type">
        <select
          className="w-90.75 h-full"
          value={match.type}
          onChange={(event) => {
            applyMatchUpdate({
              ...match,
              type: event.target.value as Match["type"],
            });
          }}
        >
          <option value="practice">Practice</option>
          <option value="qualification">Qualification</option>
          <option value="playoff">Playoff</option>
        </select>
      </InputBox>
      <InputBox name="Team #">
        <div className="flex gap-1 items-center w-90.75">
          <input
            type="number"
            className="w-24 h-full min-w-0"
            value={form.teamNumber === 0 ? "" : form.teamNumber}
            onChange={(event) => {
              userPickedTeamNumberRef.current = true;
              const n = Number(event.target.value);
              setForm((prev) => ({
                ...prev,
                teamNumber: Number.isFinite(n) ? n : 0,
              }));
            }}
          />
          <button
            type="button"
            className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-200 shrink-0"
            onClick={() => {
              userPickedTeamNumberRef.current = false;
              const newTeam = matchMatchWithTeamNumber(
                {
                  match,
                  alliance: robotPositionInfo.alliance,
                  initialLocation: robotPositionInfo.location,
                },
                mergedSlots,
              );
              setForm((prev) => ({ ...prev, teamNumber: newTeam }));
            }}
          >
            Use schedule
          </button>
        </div>
      </InputBox>
      <InputBox name="Alliance">
        <select
          className="w-90.75 h-full"
          defaultValue={robotPositionInfo.alliance}
          onChange={(event) => {
            setRobotPositionInfo((prev) => ({
              ...prev,
              alliance: event.currentTarget.value as Alliance,
            }));
          }}
        >
          <option value="red" className="text-red-400">
            Red
          </option>
          <option value="blue" className="text-blue-400">
            Blue
          </option>
        </select>
      </InputBox>
      <InputBox name="Location">
        <select
          className="w-90.75 h-full"
          defaultValue={robotPositionInfo.location}
          onChange={(event) => {
            setRobotPositionInfo((prev) => ({
              ...prev,
              location: event.currentTarget.value as InitialLocation,
            }));
          }}
        >
          <option value="close">Close</option>
          <option value="middle">Middle</option>
          <option value="far">Far</option>
        </select>
      </InputBox>
      <div className="w-120 flex justify-center">
        <button
          type="button"
          className={`w-32 h-10 sm:h-12 px-2 text-xs shrink-0 rounded-xl transition-all duration-200 border-2 ${
            form.noShow
              ? "bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] scale-[1.02]"
              : "bg-slate-800 border-white/10 text-slate-300"
          }`}
          onClick={() => {
            setForm((prev) => ({ ...prev, noShow: !prev.noShow }));
          }}
        >
          No-show
        </button>
      </div>
    </div>
  );
};

interface InputBoxProps {
  name: string;
  children: JSX.Element;
}

const InputBox: FC<InputBoxProps> = ({ name, children }) => (
  <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-12">
    <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
      <div>{`${name}:`}</div>
      {children}
    </div>
  </div>
);

export { PreMatchTab };
