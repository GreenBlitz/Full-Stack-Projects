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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px] sm:p-6">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden border border-white/10 bg-slate-950 text-slate-200 shadow-2xl shadow-black/50 sm:max-h-[calc(100vh-3rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/80 px-5 py-4 sm:px-6">
          <h2 className="text-base font-black tracking-tight text-white sm:text-lg">
            Edit Pit Data for Team {formData.teamNumber}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-6">
          <div className="border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/10">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Team Identification
            </h2>
            <div className="flex flex-col gap-2">
              <label className="ml-1 text-[10px] font-bold uppercase text-slate-500">
                Team Number
              </label>
              <input
                disabled
                type="number"
                className="border cursor-not-allowed border-white/10 bg-slate-950/70 px-4 py-3 text-xl font-mono text-gray-400 outline-none"
                value={formData.teamNumber}
                placeholder="0000"
              />
            </div>
          </div>

          <div className="border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/10 sm:p-6">
            <h2 className="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Mechanical Capabilities
            </h2>
            <div className="grid gap-3">
              {BOOLEAN_FIELDS.map(({ statKey: key, label }) => (
                <BooleanStats
                  key={key}
                  statKey={key}
                  label={label}
                  form={formData}
                  setBoolForm={setBoolForm}
                />
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/10 sm:p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Extra Information
            </h2>
            <textarea
              className="min-h-30 w-full resize-none border border-white/10 bg-slate-950/70 p-4 text-sm text-white outline-none transition focus:border-amber-500/60 placeholder:text-slate-600"
              value={formData.extraInfo ?? ""}
              onChange={(event) => setExtraForm(event.target.value)}
              placeholder="Enter extra observations..."
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row-reverse sm:items-center sm:justify-start">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-500 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-40 sm:w-auto"
            >
              Update Pit Data
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full border border-rose-500/30 bg-rose-500/10 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-rose-300 transition hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-40 sm:w-auto"
            >
              Delete Pit Data
            </button>
          </div>

          {errorMsg && (
            <div className="border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-rose-400">
              ⚠ ERROR: {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
