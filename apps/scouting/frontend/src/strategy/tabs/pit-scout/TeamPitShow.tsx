// בס"ד

import { useEffect, useState, type FC } from "react";
import type {
  PitScout,
  PitScoutBooleanKey,
  PitScoutBooleanMetric,
} from "@repo/scouting_types";
import { BOOLEAN_FIELDS } from "./PitScoutTab";

const PIT_SCOUT_URL = "/api/v1/pit/";

const resolveBool = (
  forms: PitScout[],
  key: PitScoutBooleanKey,
):
  | { state: "agree"; value: PitScoutBooleanMetric }
  | { state: "conflict"; values: PitScoutBooleanMetric[] } => {
  if (forms.length === 0) return { state: "agree", value: undefined };
  const values = forms
    .map((f) => f.booleanMetrics?.[key])
    .filter((v) => v !== undefined && v !== null) as boolean[];
  if (values.length === 0) return { state: "agree", value: undefined };
  const unique = [...new Set(values)];
  return unique.length === 1
    ? { state: "agree", value: unique[0] }
    : { state: "conflict", values };
};

const resolveNotes = (forms: PitScout[]): string[] =>
  forms.map((f) => f.extraInfo).filter((v): v is string => !!v);

type StatCellProps =
  | { label: string; state: "agree"; value: string }
  | { label: string; state: "conflict"; values: string[] };

const StatCell: FC<StatCellProps> = (props) => {
  if (props.state === "conflict") {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md border border-rose-500/30 p-4 rounded-2xl flex flex-col justify-between w-full min-h-[96px]">
        <label className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
          ⚠ {props.label}
        </label>
        <div className="flex flex-wrap gap-1 mt-auto">
          {props.values.map((v, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 bg-rose-500/10 rounded text-[10px] font-mono text-rose-300"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between w-full min-h-[96px]">
      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
        {props.label}
      </label>
      <span className="text-3xl font-black text-white block mt-auto truncate">
        {props.value}
      </span>
    </div>
  );
};

const BoolPill: FC<{ value: PitScoutBooleanMetric }> = ({ value }) => {
  if (value === undefined)
    return <span className="text-3xl font-black text-slate-500">—</span>;
  return value ? (
    <span className="text-3xl font-black text-emerald-400">Yes</span>
  ) : (
    <span className="text-3xl font-black text-rose-400">No</span>
  );
};

type BooleanStatCellProps =
  | { label: string; state: "agree"; value: PitScoutBooleanMetric }
  | { label: string; state: "conflict"; values: PitScoutBooleanMetric[] };

const BooleanStatCell: FC<BooleanStatCellProps> = (props) => {
  if (props.state === "conflict") {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md border border-rose-500/30 p-4 rounded-2xl flex flex-col justify-between w-full min-h-[96px]">
        <label className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
          ⚠ {props.label}
        </label>
        <div className="flex flex-wrap gap-1 mt-auto">
          {props.values.map((v, i) => (
            <span
              key={i}
              className="text-sm font-bold uppercase text-rose-300 mr-2"
            >
              {v ? "Y" : "N"}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between w-full min-h-[96px]">
      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
        {props.label}
      </label>
      <div className="mt-auto block">
        <BoolPill value={props.value} />
      </div>
    </div>
  );
};

const NotesCell: FC<{ notes: string[] }> = ({ notes }) => {
  if (notes.length === 0) return null;
  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 pl-1">
        Notes
      </h2>
      {notes.map((note, i) => (
        <p
          key={i}
          className="text-sm text-slate-300 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl px-4 py-3 w-full"
        >
          {note}
        </p>
      ))}
    </div>
  );
};

interface PitScoutResultsTabProps {
  teamNumber: number | null;
}

export const PitScoutResultsTab: FC<PitScoutResultsTabProps> = ({
  teamNumber,
}) => {
  const [allForms, setAllForms] = useState<PitScout[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    fetch(PIT_SCOUT_URL)
      .then((response) => response.json())
      .then((data: PitScout[]) => {
        setAllForms(data);
      })
      .catch((error) => {
        console.error("fetch error:", error);
      });
  }, []);

  useEffect(() => {
    setSelectedTeam(teamNumber);
  });

  const teams = [...new Set(allForms.map((form) => form.teamNumber))].sort();

  const teamForms = selectedTeam
    ? allForms.filter((form) => form.teamNumber === selectedTeam)
    : [];

  if (!selectedTeam || teamForms.length === 0) {
    return (
      <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
          No pit data yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        {BOOLEAN_FIELDS.map(({ statKey, label }) => (
          <BooleanStatCell
            key={statKey}
            label={label}
            {...resolveBool(teamForms, statKey)}
          />
        ))}
      </div>

      <NotesCell notes={resolveNotes(teamForms)} />
    </div>
  );
};
