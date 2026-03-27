//בס"ד
import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
const MATCH_NUMBER_MAX = 127;
const TEAM_NUMBER_MAX = 16383;
const PreMatchTab: FC<TabProps> = ({ currentForm: form, setForm }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3  mx-auto">
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-50">
          <div>Scouter Name:</div>
          <input
            type="text"
            className="inputStyle w-85 h-full"
            value={form.scouterName}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                scouterName: event.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-30">
          <div>Match Number:</div>
          <input
            type="number"
            className="inputStyle w-83.75 h-full"
            min={0}
            max={MATCH_NUMBER_MAX}
            value={form.match.number}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                match: {
                  ...prev.match,
                  number: Number(event.target.value),
                },
              }));
            }}
          />
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Team Number:</div>
          <input
            type="number"
            className="inputStyle w-85 h-full"
            min={0}
            max={TEAM_NUMBER_MAX}
            value={form.teamNumber}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                teamNumber: Number(event.target.value),
              }));
            }}
          />
        </div>
      </div>
      <div className="w-120 border-2 border-green-500 rounded-lg p-5 flex flex-col gap-3 py-0 h-15">
        <div className="flex w-115 justify-between items-center text-green-500 pr-1 h-70">
          <div>Match Type:</div>
          <select
            className="inputStyle w-90.75 h-full"
            value={form.match.type}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                match: {
                  ...prev.match,
                  type: event.target.value as
                    | "practice"
                    | "qualification"
                    | "playoff",
                },
              }));
            }}
          >
            <option value="practice">Practice</option>
            <option value="qualification">Qualification</option>
            <option value="playoff">Playoff</option>
          </select>
        </div>
      </div>
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

export { PreMatchTab };
