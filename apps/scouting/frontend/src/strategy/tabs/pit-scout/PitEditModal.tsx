import { useEffect, useState } from "react";
import type {
  PitScout,
  PitScoutBooleanKey,
  PitScoutBooleanMetric,
} from "@repo/scouting_types";
import { BsXLg as X } from "react-icons/bs";
import { BOOLEAN_FIELDS } from "./PitScoutTab";
import { BooleanStats } from "./BooleanStats";
import { PIT_SCOUT_URL } from "./PitScoutTab";

interface PitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  pitData: PitScout;
}

export const PitEditModal: React.FC<PitEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  pitData,
}) => {
  const [formData, setFormData] = useState<PitScout>(pitData);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFormData(pitData);
  }, [pitData]);

  const setBoolForm = (key: PitScoutBooleanKey, value: PitScoutBooleanMetric) =>
    setFormData((form) => ({
      ...form,
      booleanMetrics: {
        ...form.booleanMetrics,
        [key]: form.booleanMetrics[key] === value ? undefined : value,
      },
    }));

  const setExtraForm = (value: string) =>
    setFormData((form) => ({ ...form, extraInfo: value || undefined }));

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.teamNumber) {
      setErrorMsg("Team number is required.");
      return;
    }

    try {
      const res = await fetch(PIT_SCOUT_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setLoading(false);
      if (res.ok) {
        await onSuccess();
        onClose();
      } else {
        const text = await res.text();
        setErrorMsg(text || "Submission failed.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error instanceof Error ? error.message : "Network error.");
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(PIT_SCOUT_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamNumber: pitData.teamNumber }),
      });
      setLoading(false);
      if (res.ok) {
        await onSuccess();
        onClose();
      } else {
        const text = await res.text();
        setErrorMsg(text || "Deletion failed.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error instanceof Error ? error.message : "Network error.");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-nd bg-gray flex flex-col items-center gap-4 max-w-2xl mx-auto pb-12 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center space-x-2.5">
          <h2 className="text-base font-bold">
            Edit Pit Data for Team {formData.teamNumber}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          Team Identification
        </h2>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">
            Team Number
          </label>
          <input
            disabled
            type="number"
            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-xl font-mono focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-700"
            value={formData.teamNumber}
            placeholder="0000"
          />
        </div>
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
              form={formData}
              setBoolForm={setBoolForm}
            />
          ))}
        </div>
      </div>

      <div className="w-full bg-slate-800/40 border border-white/5 p-2 rounded-2xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          Extra Information
        </h2>
        <textarea
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 min-h-30 outline-none focus:border-amber-500/50 transition-all text-sm resize-none placeholder:text-slate-700"
          value={formData.extraInfo ?? ""}
          onChange={(event) => setExtraForm(event.target.value)}
          placeholder="Enter extra observations..."
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full max-w-xs py-4 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl
            disabled:opacity-40 hover:bg-emerald-400 transition-all active:scale-95
            shadow-lg shadow-emerald-900/20"
        >
          Update Pit Data
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full max-w-xs py-4 bg-rose-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl
            disabled:opacity-40 hover:bg-rose-400 transition-all active:scale-95
            shadow-lg shadow-rose-900/20"
        >
          Delete Pit Data
        </button>

        {errorMsg && (
          <div className="text-rose-400 text-[10px] font-black tracking-widest uppercase bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg">
            ⚠ ERROR: {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
