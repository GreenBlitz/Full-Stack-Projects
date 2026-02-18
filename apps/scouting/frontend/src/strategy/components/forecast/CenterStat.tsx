// בס"ד

import type { FC } from "react";

interface CenterStatProps {
  label: string;
  red: number;
  blue: number;
}

const DECIMAL_DIGIT_AMOUNT = 0;

export const CenterStat: FC<CenterStatProps> = ({
  label,
  red,
  blue,
}) => (
  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
    {/* Red Value */}
    <div className="text-right">
      <span className="text-lg font-bold text-red-400 tabular-nums">
        {red.toFixed(DECIMAL_DIGIT_AMOUNT)}
      </span>
    </div>

    {/* Center Label Pill */}
    <div className="w-24 py-1 bg-slate-900/60 border border-white/5 rounded-lg text-center shadow-inner">
      <span className="font-bold text-slate-300/90 tracking-tight">
        {label}
      </span>
    </div>

    {/* Blue Value */}
    <div className="text-left">
      <span className="text-lg font-bold text-blue-400 tabular-nums">
        {blue.toFixed(DECIMAL_DIGIT_AMOUNT)}
      </span>
    </div>
  </div>
);
