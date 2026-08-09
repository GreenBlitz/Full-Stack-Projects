import type { FC } from "react";
import type { ShiftType } from "@repo/scouting_types";
import type { TabProps } from "../ScoutMatch";
import { TeamCard } from "../../../strategy/tabs/super-scout/TeamCard";

export const TeleTab: FC<TabProps> = ({
  setForm,
  alliance,
  originTime,
  currentForm,
}) => {
  return (
    <>
      <OptionPicker
        value={currentForm.auto.balls}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            auto: { ...prev.auto, balls: value.toString() as any },
          }))
        }
      />
      <TeamCard
        teamData={currentForm.tele}
        updateTeam={(newTele) =>
          setForm((prev) => ({ ...prev, tele: newTele }))
        }
      />
    </>
  );
};

const OPTIONS = [
  "0",
  "10",
  "20",
  "30",
  "40",
  "60",
  "80",
  "100",
  "120",
  "140",
  "more",
] as const;
type Option = (typeof OPTIONS)[number];

interface OptionPickerProps {
  value: Option | undefined;
  onChange: (value: Option) => void;
}

export const OptionPicker: FC<OptionPickerProps> = ({ value, onChange }) => (
  <div className="flex flex-col gap-2 mb-5">
    <label className="text-xl font-bold uppercase text-slate-500 justify-center text-center mb-3">
      Auto Fuel
    </label>
    <div className="flex flex-wrap gap-2 justify-center ">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
            value === opt
              ? "bg-amber-500 text-slate-950"
              : "bg-slate-900/80 border border-white/5 text-slate-500 hover:text-slate-300"
          }`}
        >
          {opt === "more" ? "More" : `${opt}`}
        </button>
      ))}
    </div>
  </div>
);
