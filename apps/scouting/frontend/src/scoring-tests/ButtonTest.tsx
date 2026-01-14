// בס"ד
import { useEffect, useState, type FC } from "react";
import type { TestProps } from "./TestPage";

const startingCount = 0;
export const ButtonTest: FC<TestProps> = ({ setTest }) => {
  const [count, setCount] = useState(startingCount);
  const increments = [
    { label: "+1", value: 1, color: "bg-blue-400" },
    { label: "+3", value: 3, color: "bg-blue-500" },
    { label: "+5", value: 5, color: "bg-blue-600" },
    { label: "+10", value: 10, color: "bg-blue-700" },
  ];

  useEffect(() => {
    setTest({ amount: count });
  }, [count]);

  return (
    <div className="p-6 max-w-sm bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="text-center mb-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Current Count
        </span>
        <h2 className="text-5xl font-bold text-slate-900 mt-1">{count}</h2>
      </div>

      {/* Grid of Increment Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {increments.map((inc) => (
          <button
            key={inc.label}
            onClick={() => {
              setCount((prev) => prev + inc.value);
            }}
            className={`flex items-center justify-center py-3 px-4 rounded-lg text-white font-bold transition-all 
              ${inc.color} hover:brightness-110 active:scale-95 shadow-sm`}
          >
            {inc.label}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setCount(startingCount);
        }}
        className="mt-4 w-full py-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors uppercase tracking-tight"
      >
        Reset Counter
      </button>
    </div>
  );
};
