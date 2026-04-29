// בס"ד
// ScoutingFormView.tsx

import type { FC } from "react";
import { AutoPath } from "./AutoPath";
import { TeleSection } from "./TeleSection";
import type { ScoutingForm } from "@repo/scouting_types";

interface Point { x: number; y: number; }
interface PathPoint { point: Point; time: number; }


interface ScoutingFormViewProps {
  form: ScoutingForm;
}

const InfoCell: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl">
    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
      {label}
    </label>
    <span className="text-sm font-medium text-slate-200">{value}</span>
  </div>
);

const BoolCell: FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
    <label className="text-[10px] font-bold uppercase text-slate-500">
      {label}
    </label>
    {value ? (
      <span className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-black uppercase">
        Yes
      </span>
    ) : (
      <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-lg text-[10px] font-black uppercase">
        No
      </span>
    )}
  </div>
);

export const ScoutingFormView: FC<ScoutingFormViewProps> = ({ form }) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-12 text-slate-200">

      {/* Header */}
      <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          Match Info
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <InfoCell label="Team" value={String(form.teamNumber)} />
          <InfoCell label="Scouter" value={form.scouterName} />
          <InfoCell label="Competition" value={form.competition} />
          <InfoCell
            label="Match"
            value={`${form.match.type} #${form.match.number}`}
          />
        </div>
      </div>

      {/* Status flags */}
      {(form.robotBroken || form.noShow) && (
        <div className="grid grid-cols-2 gap-3">
          <BoolCell label="Robot Broken" value={form.robotBroken} />
          <BoolCell label="No Show" value={form.noShow} />
        </div>
      )}

      {/* Auto */}
      <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
          Auto
        </h2>
        <AutoPath path={form.auto.path} />
      </div>

      {/* Tele */}
      {(form.tele.driving || form.tele.defense || form.tele.evasion) && (
        <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
            Tele
          </h2>
          <div className="flex flex-col gap-3">
            <TeleSection label="Driving" data={form.tele.driving} />
            <TeleSection label="Defense" data={form.tele.defense} />
            <TeleSection label="Evasion" data={form.tele.evasion} />
          </div>
        </div>
      )}

      {/* Comment */}
      {form.comment && (
        <div className="w-full bg-slate-800/40 border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">
            Comment
          </h2>
          <p className="text-sm text-slate-200 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3">
            {form.comment}
          </p>
        </div>
      )}

    </div>
  );
};