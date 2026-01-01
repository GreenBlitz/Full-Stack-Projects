// בס"ד
import type React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { urlMatches, type MatchesSimpleType } from "./endpoints/MatchSimple";
import {
  urlTeamsInEvent,
  type TeamsInEventType,
} from "./endpoints/TeamsSimple";
import useLocalStorage from "./Hooks/LocalStorageHook";

const targetTeamNumber = 4590;
const backendPort = 4590;
const refreshIntervalMs = 30000;
const timeMultiplier = 1000;
const sliceStart = 3;
const firstIndex = 0;
const nextMatchLimit = 2;
const noGap = 0;
const matchTimeDefault = 0;
const matchTimeMissing = 0;
const dayInSeconds = 86400;
const notFoundIndex = -1;

const sortABeforeB = -1;
const sortBBeforeA = 1;
const weightQm = 1;
const weightEf = 2;
const weightQf = 3;
const weightSf = 4;
const weightF = 5;
const weightDefault = 99;

const targetTeamKey = `frc${targetTeamNumber}`;
const backendBaseUrl = `http://localhost:${backendPort}/fetch?url=`;

interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

interface RankItem {
  rank: number;
  team_key: string;
  record: TeamRecord;
}

interface RankingsResponse {
  rankings: RankItem[];
}

const urlRankings = (eventKey: string) =>
  `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`;

const fetchFromProxy = async <T,>(targetUrl: string): Promise<T> => {
  const fullUrl = `${backendBaseUrl}${encodeURIComponent(targetUrl)}`;
  const response = await fetch(fullUrl);

  return response.ok
    ? (response.json() as Promise<T>)
    : Promise.reject(new Error(`HTTP error status: ${response.status}`));
};

const getLevelWeight = (level: string): number =>
  level === "qm"
    ? weightQm
    : level === "ef"
      ? weightEf
      : level === "qf"
        ? weightQf
        : level === "sf"
          ? weightSf
          : level === "f"
            ? weightF
            : weightDefault;

const getMatchDisplayName = (match: MatchesSimpleType): string => {
  const level = match.comp_level.toUpperCase();
  switch (level) {
    case "QM":
      return `Quals ${match.match_number}`;
    case "QF":
      return `Quarterfinal ${match.set_number}, Match ${match.match_number}`;
    case "SF":
      return `Semifinal ${match.set_number}, Match ${match.match_number}`;
    case "F":
      return `Finals Match ${match.match_number}`;
    case "EF":
      return `Octofinal ${match.set_number}, Match ${match.match_number}`;
    default:
      return `${level} ${match.match_number}`;
  }
};

const App: React.FC = () => {
  const [activeEventKey, setActiveEventKey] = useLocalStorage<string>(
    "dashboard_active_event",
    ""
  );
  const [inputEventKey, setInputEventKey] = useState<string>(activeEventKey);
  const [teams, setTeams] = useState<TeamsInEventType[]>([]);
  const [allMatches, setAllMatches] = useState<MatchesSimpleType[]>([]);
  const [teamRank, setTeamRank] = useState<RankItem | null>(null);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const resetInSearch = () => {
    setSearchStatus("loading");
    setAllMatches([]);
    setTeams([]);
    setTeamRank(null);
  };

  const sortMatches = useCallback(
    (a: MatchesSimpleType, b: MatchesSimpleType) => {
      const timeA = a.predicted_time ?? a.time ?? matchTimeDefault;
      const timeB = b.predicted_time ?? b.time ?? matchTimeDefault;
      const weightA = getLevelWeight(a.comp_level);
      const weightB = getLevelWeight(b.comp_level);

      if (timeA > matchTimeMissing && timeB > matchTimeMissing) {
        return timeA - timeB;
      } else if (timeA > matchTimeMissing && timeB === matchTimeMissing) {
        return sortABeforeB;
      } else if (timeA === matchTimeMissing && timeB > matchTimeMissing) {
        return sortBBeforeA;
      } else if (weightA !== weightB) {
        return weightA - weightB;
      } else if (a.comp_level !== "qm") {
        if (a.set_number !== b.set_number) {
          return a.set_number - b.set_number;
        }
        return a.match_number - b.match_number;
      }

      return a.match_number - b.match_number;
    },
    []
  );

  const performSearch = useCallback(
    async (eventKey: string) => {
      if (!eventKey) return;

      resetInSearch();
      setActiveEventKey(eventKey);

      try {
        const teamsUrl = urlTeamsInEvent(eventKey);
        const matchesUrl = urlMatches(eventKey);
        const rankingsUrl = urlRankings(eventKey);

        const [teamsData, matchesData, rankingsData] = await Promise.all([
          fetchFromProxy<TeamsInEventType[]>(teamsUrl),
          fetchFromProxy<MatchesSimpleType[]>(matchesUrl),
          fetchFromProxy<RankingsResponse>(rankingsUrl).catch(() => ({
            rankings: [],
          })),
        ]);

        if (Array.isArray(teamsData) && Array.isArray(matchesData)) {
          setTeams(teamsData);
          matchesData.sort(sortMatches);
          setAllMatches(matchesData);
          setTeamRank(
            rankingsData.rankings.find((r) => r.team_key === targetTeamKey) ??
              null
          );
          setSearchStatus("success");
        } else {
          setSearchStatus("error");
        }
      } catch {
        setSearchStatus("error");
      }
    },
    [setActiveEventKey, sortMatches]
  );

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formattedKey = inputEventKey.trim().toLowerCase();
    void performSearch(formattedKey);
  };

  useEffect(() => {
    if (activeEventKey && searchStatus === "idle") {
      void performSearch(activeEventKey);
    }
  }, [activeEventKey, performSearch, searchStatus]);

  useEffect(() => {
    const intervalId: number | undefined =
      searchStatus === "success" && activeEventKey
        ? window.setInterval(() => {
            const matchesUrl = urlMatches(activeEventKey);
            const rankingsUrl = urlRankings(activeEventKey);

            void fetchFromProxy<MatchesSimpleType[]>(matchesUrl)
              .then((data) => {
                if (Array.isArray(data)) {
                  data.sort(sortMatches);
                  setAllMatches(data);
                }
              })
              .catch(console.error);

            void fetchFromProxy<RankingsResponse>(rankingsUrl)
              .then((data) => {
                const myRank =
                  data.rankings.find((r) => r.team_key === targetTeamKey) ??
                  null;
                setTeamRank(myRank);
              })
              .catch(console.error);
          }, refreshIntervalMs)
        : undefined;

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeEventKey, searchStatus, sortMatches]);

  const teamNameMap = useMemo(() => {
    const map: Map<string, string> = new Map();
    teams.forEach((team) => map.set(team.key, team.nickname));
    return map;
  }, [teams]);

  const {
    currentGlobalMatch,
    targetTeamMatches,
    futureMatches,
    isEventOver,
    isTeamDone,
    isFutureEvent,
  } = useMemo(() => {
    // normal one
    // const currentTimeSecs = Math.floor(Date.now() / timeMultiplier);

    // testing 2025isios
    // const currentTimeSecs = Math.floor(
    //   new Date("2025-10-08T13:44:00").getTime() / timeMultiplier
    // );

    // testing 2025iscmp
    // const currentTimeSecs = Math.floor(
    //   new Date("2025-03-27T10:00:00").getTime() / timeMultiplier
    // );

    // testing 2024iscmp
    const currentTimeSecs = Math.floor(
      new Date("2024-03-21T18:00:00").getTime() / timeMultiplier
    );

    // testing 2025cmptx
    //const currentTimeSecs = Math.floor(new Date("2025-04-19T10:00:00").getTime() / timeMultiplier);

    const getMatchTime = (match: MatchesSimpleType) =>
      match.predicted_time ?? match.time ?? matchTimeDefault;

    const futureMatchesArr = allMatches.filter((match) => {
      const time = getMatchTime(match);
      return time === matchTimeMissing || time > currentTimeSecs;
    });

    const pastMatchesArr = allMatches.filter((match) => {
      const time = getMatchTime(match);
      return time > matchTimeMissing && time <= currentTimeSecs;
    });

    futureMatchesArr.sort(sortMatches);

    const currentMatch =
      futureMatchesArr.length > noGap
        ? futureMatchesArr[firstIndex]
        : undefined;

    const teamFutureMatches = futureMatchesArr.filter(
      (match) =>
        match.alliances.blue.team_keys.includes(targetTeamKey) ||
        match.alliances.red.team_keys.includes(targetTeamKey)
    );

    const teamPastMatches = pastMatchesArr.filter(
      (match) =>
        match.alliances.blue.team_keys.includes(targetTeamKey) ||
        match.alliances.red.team_keys.includes(targetTeamKey)
    );

    const hasEventEnded =
      futureMatchesArr.length === noGap && allMatches.length > noGap;

    const hasTeamDone =
      !hasEventEnded &&
      teamFutureMatches.length === noGap &&
      teamPastMatches.length > noGap;

    const isNextMatchInFarFuture = currentMatch
      ? getMatchTime(currentMatch) > currentTimeSecs + dayInSeconds &&
        getMatchTime(currentMatch) !== matchTimeMissing
      : false;

    return {
      currentGlobalMatch: currentMatch,
      targetTeamMatches: hasTeamDone
        ? []
        : teamFutureMatches.slice(firstIndex, nextMatchLimit),
      futureMatches: futureMatchesArr,
      isEventOver: hasEventEnded,
      isTeamDone: hasTeamDone,
      isFutureEvent: isNextMatchInFarFuture,
    };
  }, [allMatches, sortMatches]);

  return (
    <div className="min-h-screen bg-neutral-100 pb-10 font-sans text-gray-900">
      <div className="bg-slate-700 py-5 text-white shadow-md">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="mb-4 text-3xl font-normal">FRC Dashboard</h1>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Event ID (e.g., 2025isios)"
              value={inputEventKey}
              onChange={(event) => {
                setInputEventKey(event.target.value);
              }}
              className="flex-1 rounded-md p-3 text-base text-white-900 outline-none ring-2 focus:ring-slate-500 ring-gray-600 search-input"
            />
            <button
              type="submit"
              disabled={searchStatus === "loading"}
              className="rounded-md bg-white-500 px-6 py-3 text-base font-bold text-white-400 transition hover:bg-white-200 disabled:opacity-70"
            >
              {searchStatus === "loading" ? "..." : "Load"}
            </button>
          </form>

          {searchStatus === "error" && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Event not found.
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl px-5">
        {searchStatus === "success" && (
          <>
            <div className="mb-5 flex items-center justify-between text-sm text-gray-500">
              <span>
                <strong>Event:</strong> {activeEventKey}
              </span>
              <span>
                <strong>Teams:</strong> {teams.length}
              </span>
            </div>

            <div
              className={`mb-8 rounded-xl bg-white p-5 shadow-sm border-l-[6px] ${
                isFutureEvent ? "border-blue-500" : "border-amber-500"
              }`}
            >
              <h2
                className={`mb-1 text-sm font-bold uppercase tracking-wider ${
                  isFutureEvent ? "text-blue-500" : "text-amber-500"
                }`}
              >
                {isFutureEvent ? "Upcoming Event" : "Current Field Status"}
              </h2>
              {currentGlobalMatch !== undefined ? (
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-gray-800">
                    {getMatchDisplayName(currentGlobalMatch)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isFutureEvent
                        ? "bg-blue-50 text-blue-500"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {isFutureEvent ? "SCHEDULED" : "IN PROGRESS"}
                  </span>
                </div>
              ) : (
                <p className="italic text-gray-400">
                  {allMatches.length > noGap
                    ? "Event Concluded"
                    : "No matches scheduled"}
                </p>
              )}
            </div>

            <h2 className="mb-5 border-b-2 border-gray-200 pb-2 text-2xl text-gray-800">
              {isEventOver
                ? `Final Results: Team ${targetTeamNumber}`
                : `Upcoming: Team ${targetTeamNumber}`}
            </h2>

            {isEventOver ? (
              <div className="rounded-xl bg-white p-8 text-center shadow-md">
                {teamRank ? (
                  <>
                    <div className="mb-2 text-base uppercase tracking-wider text-gray-500">
                      Final Rank
                    </div>
                    <div className="text-6xl font-bold leading-none text-indigo-700">
                      #{teamRank.rank}
                    </div>
                    <div className="mt-5 inline-block rounded-full bg-indigo-50 px-5 py-2 font-bold text-indigo-700">
                      Record: {teamRank.record.wins}-{teamRank.record.losses}-
                      {teamRank.record.ties}
                    </div>
                  </>
                ) : (
                  <p className="italic text-gray-500">
                    Rank data not available for this event.
                  </p>
                )}
              </div>
            ) : (
              <>
                {targetTeamMatches.length === noGap && (
                  <div className="rounded-xl bg-white p-10 text-center text-gray-400">
                    {isTeamDone ? (
                      <p>
                        Team {targetTeamNumber} has completed all scheduled
                        matches for this event (or for today).
                      </p>
                    ) : (
                      <p>
                        No upcoming matches found for Team {targetTeamNumber}.
                      </p>
                    )}
                  </div>
                )}

                {targetTeamMatches.map((match) => {
                  const effectiveTime = match.predicted_time ?? match.time;
                  const predictedDate = effectiveTime
                    ? new Date(
                        effectiveTime * timeMultiplier
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "TBD";

                  const matchIndex = futureMatches.findIndex(
                    (m) => m.key === match.key
                  );
                  const matchesAway =
                    matchIndex > notFoundIndex ? matchIndex : noGap;

                  const isRedAlliance =
                    match.alliances.red.team_keys.includes(targetTeamKey);

                  return (
                    <div
                      key={match.key}
                      className="mb-5 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                        <div>
                          <span className="text-xl font-bold text-gray-800">
                            {getMatchDisplayName(match)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {predictedDate}
                          </div>
                          <div
                            className={`mt-1 text-sm font-bold ${
                              matchesAway <= nextMatchLimit
                                ? "text-red-700"
                                : "text-gray-500"
                            }`}
                          >
                            {matchesAway <= noGap
                              ? "PLAYING NOW"
                              : `IN ${matchesAway} MATCHES`}
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <div
                          className={`flex-1 border-t-4 border-red-400 p-4 ${
                            isRedAlliance ? "bg-red-50" : "bg-white"
                          }`}
                        >
                          <div className="mb-2 text-sm font-bold uppercase text-red-700">
                            Red Alliance
                          </div>
                          {match.alliances.red.team_keys.map((teamKey) => {
                            const teamNumber = teamKey.slice(sliceStart);
                            const teamName =
                              teamNameMap.get(teamKey) ?? "Unknown";
                            const isTargetTeam = teamKey === targetTeamKey;
                            return (
                              <div
                                key={teamKey}
                                className={`mb-1.5 flex items-center ${
                                  isTargetTeam ? "font-bold" : "font-normal"
                                }`}
                              >
                                <span className="w-12 font-bold text-gray-800">
                                  {teamNumber}
                                </span>
                                <span className="truncate text-sm text-gray-600">
                                  {teamName}
                                </span>
                                {isTargetTeam && (
                                  <span className="ml-auto rounded bg-red-700 px-1.5 py-0.5 text-[10px] text-white">
                                    YOU
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div
                          className={`flex-1 border-l border-t-4 border-gray-100 border-t-blue-400 p-4 ${
                            !isRedAlliance ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <div className="mb-2 text-sm font-bold uppercase text-blue-700">
                            Blue Alliance
                          </div>
                          {match.alliances.blue.team_keys.map((teamKey) => {
                            const teamNumber = teamKey.slice(sliceStart);
                            const teamName =
                              teamNameMap.get(teamKey) ?? "Unknown";
                            const isTargetTeam = teamKey === targetTeamKey;
                            return (
                              <div
                                key={teamKey}
                                className={`mb-1.5 flex items-center ${
                                  isTargetTeam ? "font-bold" : "font-normal"
                                }`}
                              >
                                <span className="w-12 font-bold text-gray-800">
                                  {teamNumber}
                                </span>
                                <span className="truncate text-sm text-gray-600">
                                  {teamName}
                                </span>
                                {isTargetTeam && (
                                  <span className="ml-auto rounded bg-blue-700 px-1.5 py-0.5 text-[10px] text-white">
                                    YOU
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
