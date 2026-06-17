//בס"ד

import { useState, type FC } from "react";
import type {
  PitScout,
  PitScoutBoolean,
  PitScoutBooleanKey,
  PitScoutBooleanMetric,
  PitScoutNumber,
  PitScoutNumberKey,
} from "@repo/scouting_types";
import { NumberStats } from "./NumberStats";
import { BooleanStats } from "./BooleanStats";

export const NUMBER_FIELDS: {
  statKey: PitScoutNumberKey;
  label: string;
  placeholder: string;
}[] = [
  {
    statKey: "robotWeight",
    label: "Robot Weight (lbs)",
    placeholder: "e.g. 120",
  },
  { statKey: "ballCapacity", label: "Ball Capacity", placeholder: "e.g. 50" },
];

const PIT_SCOUT_URL = "/api/v1/pit/";

export const BOOLEAN_FIELDS: { statKey: PitScoutBooleanKey; label: string }[] =
  [
    { statKey: "hasTurret", label: "Has turret?" },
    { statKey: "canPassTrench", label: "Can pass trench?" },
    { statKey: "canPassBumpEasily", label: "Can pass bump easily?" },
  ];

const initialState: PitScout = {
  teamNumber: 0,
  numberMetrics: { robotWeight: undefined, ballCapacity: undefined },
  booleanMetrics: {
    hasTurret: undefined,
    canPassTrench: undefined,
    canPassBumpEasily: undefined,
  },
  extraInfo: undefined,
};

export const PitScoutTab: FC = () => {
  const [form, setForm] = useState<PitScout>(initialState);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const setNumberForm = (key: PitScoutNumberKey, value: number) =>
    setForm((form) => ({
      ...form,
      numberMetrics: { ...form.numberMetrics, [key]: value || undefined },
    }));
  const setBoolForm = (key: PitScoutBooleanKey, value: PitScoutBooleanMetric) =>
    setForm((form) => ({
      ...form,
      booleanMetrics: {
        ...form.booleanMetrics,
        [key]: form.booleanMetrics[key] === value ? undefined : value,
      },
    }));

  const setExtraForm = (value: string) =>
    setForm((form) => ({ ...form, extraInfo: value || undefined }));

  const handleSubmit = async () => {
    if (!form.teamNumber) {
      setStatus("error");
      setErrorMsg("Team number is required.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(PIT_SCOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm(initialState);
      } else {
        const text = await res.text();
        setStatus("error");
        setErrorMsg(text || "Submission failed.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "Network error.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto pb-12 text-slate-200">
      <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          Team Identification
        </h2>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">
            Team Number
          </label>
          <input
            type="number"
            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-xl font-mono focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-700"
            value={form.teamNumber || ""}
            onChange={(event) =>
              setForm((form) => ({
                ...form,
                teamNumber: parseInt(event.target.value) || 0,
              }))
            }
            placeholder="0000"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {NUMBER_FIELDS.map(({ statKey: key, label, placeholder }) => (
          <NumberStats
            statKey={key}
            label={label}
            placeholder={placeholder}
            form={form}
            setNumberForm={setNumberForm}
          />
        ))}
      </div>

      <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-6">
          Mechanical Capabilities
        </h2>
        <div className="grid gap-4">
          {BOOLEAN_FIELDS.map(({ statKey: key, label }) => (
            <BooleanStats
              statKey={key}
              label={label}
              form={form}
              setBoolForm={setBoolForm}
            />
          ))}
        </div>
      </div>

      <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          extra information
        </h2>
        <textarea
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 min-h-[120px] outline-none focus:border-amber-500/50 transition-all text-sm resize-none placeholder:text-slate-700"
          value={form.extraInfo ?? ""}
          onChange={(event) => setExtraForm(event.target.value)}
          placeholder="Enter extra observations..."
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="w-full max-w-xs py-4 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl
            disabled:opacity-40 hover:bg-emerald-400 transition-all active:scale-95
            shadow-lg shadow-emerald-900/20"
        >
          {status === "loading" ? "Transmitting..." : "Submit"}
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
            <span className="text-[10px] font-black tracking-widest uppercase">
              ✓ Data Synced Successfully
            </span>
          </div>
        )}
        {status === "error" && (
          <div className="text-rose-400 text-[10px] font-black tracking-widest uppercase bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg">
            ⚠ ERROR: {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
