// בס"ד

import { useState, type FC } from "react";
import type { TeamData } from "@repo/scouting_types";

const NUMBER_OF_DIGITS = 2;
const Metric: FC<{
  name: string;
  value: number;
  colors: string;
  onClick?: () => void;
}> = ({ name, value, colors, onClick }) => (
  <div
    className={`flex flex-col items-center text-center justify-center p-4 rounded-2xl border-2 transition-all shadow-lg 
          ${colors}`}
    onClick={onClick}
  >
    <span className="text-xl uppercase tracking-widest opacity-70 font-black mb-1">
      {name}
    </span>
    <span className="text-3xl font-black">
      {value.toFixed(NUMBER_OF_DIGITS)}
    </span>
  </div>
);

export const MetricsChart: FC<TeamData["metrics"]> = ({ epa, bps, coprs }) => {
  const [isCOPROpen, setCOPROpenness] = useState(false);
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto p-2">
      <Metric
        name="EPA"
        value={epa}
        colors="bg-cyan-500/20 border-cyan-500/50 text-cyan-200"
      />
      <Metric
        name="BPS"
        value={bps}
        colors="bg-purple-500/20 border-purple-500/50 text-purple-200"
      />
      {coprs && (
        <Metric
          name="OPR"
          value={coprs.totalPoints ?? 0}
          colors="bg-orange-500/20 border-orange-500/50 text-orange-200"
          onClick={() => setCOPROpenness(true)}
        />
      )}
      <DataModal
        isOpen={isCOPROpen}
        onClose={() => setCOPROpenness(false)}
        title="COPRS"
        data={coprs ?? {}}
      />
    </div>
  );
};

interface DataModalProps {
  data: Record<string, number | undefined>;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({
  data,
  title,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border-2 border-[#e8d52e] w-full max-w-md rounded-xl shadow-[0_0_20px_rgba(232,213,46,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#e8d52e] p-3 flex justify-between items-center">
          <h2 className="text-black font-black italic tracking-wider uppercase">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:scale-110 transition-transform font-bold text-xl px-2"
          >
            ✕
          </button>
        </div>

        {/* Content - The Record List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0"
            >
              <span className="text-gray-400 font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")} {/* Add spaces to camelCase */}
              </span>
              <span className="text-[#e8d52e] font-black text-lg font-mono">
                {value?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/20 text-center">
          <button
            onClick={onClose}
            className="bg-[#e8d52e] text-black px-6 py-2 rounded font-bold hover:brightness-110 transition-all uppercase text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
