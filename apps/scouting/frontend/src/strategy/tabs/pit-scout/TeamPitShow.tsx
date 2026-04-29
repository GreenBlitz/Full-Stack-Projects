// בס"ד

import { useEffect, useState, type FC } from "react";
import type {
  PitScout,
  PitScoutBooleanKey,
  PitScoutBooleanMetric,
  PitScoutNumberKey,
} from "@repo/scouting_types";
import { BOOLEAN_FIELDS, NUMBER_FIELDS } from "./PitScoutTab";

const PIT_SCOUT_URL = "/api/v1/pit/";
const NO_ANSWER = "N/A";

const resolveField = <T,>(
  forms: PitScout[],
  extract: (form: PitScout) => T,
  display: (value: T) => string,
):
  | { state: "agree"; value: string }
  | { state: "conflict"; values: string[] } => {
  if (forms.length === 0) return { state: "agree", value: "N/A" };
  const values = forms
    .map(extract)
    .filter((v) => v !== undefined && v !== null) as T[];
  if (values.length === 0) return { state: "agree", value: "N/A" };
  const unique = [...new Set(values)];
  return unique.length === 1
    ? { state: "agree", value: display(unique[0]) }
    : { state: "conflict", values: values.map(display) };
};

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

// --- StatCell ---

type StatCellProps =
  | { label: string; state: "agree"; value: string }
  | { label: string; state: "conflict"; values: string[] };

const StatCell: FC<StatCellProps> = (props) => {
  if (props.state === "conflict") {
    return (
      <div className="bg-slate-800/40 border border-rose-500/30 p-4 rounded-2xl">
        <label className="text-[10px] font-bold uppercase text-rose-400 block mb-2">
          ⚠ {props.label} — conflict
        </label>
        <div className="flex flex-wrap gap-2">
          {props.values.map((v, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm font-mono text-rose-300"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl">
      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">
        {props.label}
      </label>
      <span className="text-sm font-medium text-slate-200">{props.value}</span>
    </div>
  );
};


const BoolPill: FC<{ value: PitScoutBooleanMetric }> = ({ value }) => {
  if (value === undefined)
    return (
      <span className="px-4 py-1.5 bg-slate-900/80 border border-white/5 rounded-lg text-[10px] font-black uppercase text-slate-500">
        N/A
      </span>
    );
  return value ? (
    <span className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-black uppercase">
      Yes
    </span>
  ) : (
    <span className="px-4 py-1.5 bg-rose-500 text-slate-950 rounded-lg text-[10px] font-black uppercase">
      No
    </span>
  );
};


type BooleanStatCellProps =
  | { label: string; state: "agree"; value: PitScoutBooleanMetric }
  | { label: string; state: "conflict"; values: PitScoutBooleanMetric[] };

const BooleanStatCell: FC<BooleanStatCellProps> = (props) => {
  if (props.state === "conflict") {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-rose-400">
          ⚠ {props.label}
        </span>
        <div className="flex gap-2 bg-slate-900/80 p-1 rounded-xl border border-rose-500/20">
          {props.values.map((v, i) => (
            <BoolPill key={i} value={v} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
        {props.label}
      </span>
      <div className="flex gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/5">
        <BoolPill value={props.value} />
      </div>
    </div>
  );
};


const NotesCell: FC<{ notes: string[] }> = ({ notes }) => {
  if (notes.length === 0)
    return (
      <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl">
        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">
          Notes
        </label>
        <span className="text-sm text-slate-500">—</span>
      </div>
    );
  return (
    <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl">
      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-3">
        Notes
      </label>
      <div className="flex flex-col gap-2">
        {notes.map((note, i) => (
          <p
            key={i}
            className="text-sm text-slate-200 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2"
          >
            {note}
          </p>
        ))}
      </div>
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
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "done">(
    "loading",
  );

  useEffect(() => {
    fetch(PIT_SCOUT_URL)
      .then((response) => response.json())
      .then((data: PitScout[]) => {
        setAllForms(data);
        setLoadStatus("done");
      })
      .catch((error) => {
        console.error("fetch error:", error);
        setLoadStatus("error");
      });
  }, []);

  useEffect(() => {
    setSelectedTeam(teamNumber);
  });

  const teams = [...new Set(allForms.map((form) => form.teamNumber))].sort();

  const teamForms = selectedTeam
    ? allForms.filter((form) => form.teamNumber === selectedTeam)
    : [];

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto pb-12 text-slate-200">
      {selectedTeam && teamForms.length > 0 ? (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {NUMBER_FIELDS.map(({ statKey, label }) => (
              <StatCell
                key={statKey}
                label={label}
                {...resolveField(
                  teamForms,
                  (f) => f.numberMetrics?.[statKey],
                  (v) => v?.toString() ?? "N/A",
                )}
              />
            ))}
          </div>

          <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-6">
              Mechanical Capabilities
            </h2>
            <div className="grid gap-4">
              {BOOLEAN_FIELDS.map(({ statKey, label }) => (
                <BooleanStatCell
                  key={statKey}
                  label={label}
                  {...resolveBool(teamForms, statKey)}
                />
              ))}
            </div>
          </div>

          <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
              Extra Information
            </h2>
            <NotesCell notes={resolveNotes(teamForms)} />
          </div>
        </>
      ) : (
        <p>no pit scouting recorded yet</p>
      )}
    </div>
  );
};
