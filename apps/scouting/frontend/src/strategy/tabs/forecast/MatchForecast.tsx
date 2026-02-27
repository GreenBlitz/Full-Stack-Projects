// בס"ד
import { useEffect, useState, type FC } from "react";
import type { Forecast } from "@repo/scouting_types";
import { CenterStat } from "./CenterStat";
import { StatRow } from "./StatRow";

interface Alliances {
  redAlliance: [number, number, number];
  blueAlliance: [number, number, number];
}

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
  const [alliances, _setAlliances] = useState<Alliances | undefined>();

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

  const redData = forecast?.allianceData.redAlliance;
  const blueData = forecast?.allianceData.blueAlliance;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center px-6 py-4 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl">
        <div className="text-center">
          <span className="text-red-500 font-black text-2xl tracking-tighter uppercase">
            {alliances?.redAlliance.join(", ")}
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
            {alliances?.blueAlliance.join(", ")}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      {redData && blueData && (
        <div className="grid grid-cols-1 gap-4">
          {/* Fuel Section */}
          <StatRow red={redData.fuel.fullGame} blue={blueData.fuel.fullGame} />

          {/* Detailed Breakdown */}
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-red-500/40" />
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Details
              </h4>
              <div className="h-px flex-1 bg-linear-to-l from-transparent to-blue-500/40" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-slate-800" />
                <div
                  className={`px-4 py-1 rounded-full border font-black uppercase tracking-[0.15em]`}
                >
                  Auto
                </div>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <CenterStat
                label="Fuel"
                red={redData.fuel.auto}
                blue={blueData.fuel.auto}
              />
              <CenterStat
                label="Climb"
                red={redData.climb.auto}
                blue={blueData.climb.auto}
              />

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-slate-800" />
                <div
                  className={`px-4 py-1 rounded-full border font-black uppercase tracking-[0.15em]`}
                >
                  Tele
                </div>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <CenterStat
                label="Fuel"
                red={redData.fuel.tele}
                blue={blueData.fuel.tele}
              />
              <CenterStat
                label="Climb"
                red={redData.climb.tele}
                blue={blueData.climb.tele}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
