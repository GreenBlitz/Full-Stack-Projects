// בס"ד

import type { FC } from "react";

interface StatRowProps {
  red: number;
  blue: number;
}

export const StatRow: FC<StatRowProps> = ({ red, blue }) => {
  const isRedLeading = red > blue;
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center relative z-10">
        <div
          className={`font-black text-red-500 ${isRedLeading ? "text-3xl" : "text-2xl"}`}
        >
          {red}
        </div>
        <div
          className={`font-black text-3xl ${isRedLeading ? "text-red-500" : "text-blue-500"}`}
        >
          {`${isRedLeading ? "Red" : "Blue"} Wins`}
        </div>
        <div
          className={`font-black text-blue-500 ${!isRedLeading ? "text-3xl" : "text-2xl"}`}
        >
          {blue}
        </div>
      </div>
    </div>
  );
};
