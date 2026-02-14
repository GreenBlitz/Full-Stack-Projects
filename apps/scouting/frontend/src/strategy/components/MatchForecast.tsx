// בס"ד
import { useEffect, useState, type FC, type JSX } from "react";
import type { Forecast } from "@repo/scouting_types";
import { Fuel, Zap } from "lucide-react";

interface Alliances {
  redAlliance: [number, number, number];
  blueAlliance: [number, number, number];
}

interface StatRowProps {
  label: string;
  icon: JSX.Element;
  red: number;
  blue: number;
  subtext: string;
}
const StatRow: FC<StatRowProps> = ({ label, icon, red, blue, subtext }) => {
  const isRedLeading = red > blue;
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center relative z-10">
        <div
          className={`font-black ${isRedLeading ? "text-red-500 text-3xl" : "text-slate-300 text-2xl"}`}
        >
          {red}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-slate-500 flex items-center gap-2 mb-1">
            {icon}{" "}
            <span className="text-xs font-bold uppercase tracking-tighter">
              {label}
            </span>
          </div>
          <div className="text-[10px] text-slate-600 font-medium uppercase italic">
            {subtext}
          </div>
        </div>
        <div
          className={`font-black ${!isRedLeading ? "text-blue-500 text-3xl" : "text-slate-300 text-2xl"}`}
        >
          {blue}
        </div>
      </div>
      {/* Background visual bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-500"
        style={{ width: `${(red / (red + blue)) * 100}%` }}
      />
      <div
        className="absolute bottom-0 right-0 h-1 bg-blue-500 transition-all duration-500"
        style={{ width: `${(blue / (red + blue)) * 100}%` }}
      />
    </div>
  );
};

interface MiniStatProps {
  label: string;
  value: number;
  align: "left" | "right";
}

const MiniStat: FC<MiniStatProps> = ({ label, value, align = "left" }) => (
  <div
    className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}
  >
    <span className="text-[10px] text-slate-500 uppercase font-bold">
      {label}
    </span>
    <span className="text-lg font-bold text-slate-200">{value}</span>
  </div>
);

const querifyAlliances = (alliances: Alliances) => {
  const params = new URLSearchParams();
  alliances.redAlliance.forEach((team) => {
    params.append("redAlliance", team.toString());
  });
  alliances.blueAlliance.forEach((team) => {
    params.append("blueAlliance", team.toString());
  });
  return params;
};

export const MatchForecast: FC = () => {
  const [forecast, setForecast] = useState<Forecast>();
  const [alliances, setAlliances] = useState<Alliances>({
    redAlliance: [4590, 1690, 1577],
    blueAlliance: [2230, 2231, 4586],
  });

  const updateForecast = async () => {
    if (!alliances) {
      return;
    }

    const query = querifyAlliances(alliances);
    try {
      const response = await fetch(`/api/v1/forecast?${query.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bad Response: ${errorText}`);
      }
      const fetchedForecast: Forecast = await response.json();
      setForecast(fetchedForecast);
    } catch (error: unknown) {
      alert(error);
    }
  };
  useEffect(() => {
    void updateForecast();
  }, [alliances]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center px-6 py-4 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl">
        <div className="text-center">
          <span className="text-red-500 font-black text-2xl tracking-tighter uppercase">
            Red Alliance
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest">
            Prediction
          </div>
          <span className="text-slate-100 font-black text-3xl">VS</span>
        </div>
        <div className="text-center">
          <span className="text-blue-500 font-black text-2xl tracking-tighter uppercase">
            Blue Alliance
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      {forecast && (
        <div className="grid grid-cols-1 gap-4">
          {/* Fuel Section */}
          <StatRow
            label="Fuel Scoring"
            icon={<Fuel size={18} />}
            red={forecast.allianceData.redAlliance.fuel.fullGame}
            blue={forecast.allianceData.blueAlliance.fuel.fullGame}
            subtext="Full Game Total"
          />

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {/* Red Detailed Card */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5 space-y-4">
              <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} /> Red Breakdown
              </h4>
              <MiniStat
                label="Auto Fuel"
                value={forecast.allianceData.redAlliance.fuel.auto}
              />
              <MiniStat
                label="Tele Fuel"
                value={forecast.allianceData.redAlliance.fuel.tele}
              />
              <div className="h-px bg-red-500/20 my-2" />
              <MiniStat
                label="Climb (Auto/Tele)"
                value={`${forecast.allianceData.redAlliance.climb.auto} / ${forecast.allianceData.redAlliance.climb.tele}`}
              />
            </div>

            {/* Blue Detailed Card */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-5 space-y-4">
              <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-right justify-end">
                Blue Breakdown <Zap size={14} />
              </h4>
              <MiniStat
                label="Auto Fuel"
                value={forecast.allianceData.blueAlliance.fuel.auto}
                align="right"
              />
              <MiniStat
                label="Tele Fuel"
                value={forecast.allianceData.blueAlliance.fuel.tele}
                align="right"
              />
              <div className="h-px bg-blue-500/20 my-2" />
              <MiniStat
                label="Climb (Auto/Tele)"
                value={`${forecast.allianceData.blueAlliance.climb.auto} / ${forecast.allianceData.blueAlliance.climb.tele}`}
                align="right"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Sub-Components for Cleanliness --- */
