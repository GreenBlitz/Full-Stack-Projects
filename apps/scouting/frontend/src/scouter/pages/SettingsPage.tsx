// בס"ד
import type { FC } from "react";
import { useLocalStorage } from "@repo/local_storage_hook";
import ToggleSetting from "../components/ToggleSetting";

interface SettingsKeyType {
  matchStarter: boolean;
  moveAutomaticallyToNextShift: boolean;
  startTimerOnSetPoint: boolean;
}

const defaultSettings: SettingsKeyType = {
  matchStarter: false,
  moveAutomaticallyToNextShift: false,
  startTimerOnSetPoint: false,
};

const SettingsPage: FC = () => {
  const [isSettingsKey, setSettingsKey] = useLocalStorage<SettingsKeyType>(
    "settings",
    defaultSettings,
  );

  const updateSetting = (key: keyof SettingsKeyType, value: boolean) => {
    setSettingsKey((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4 force-landscape">
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-emerald-800 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)] p-6">
          <div className="flex flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-emerald-400">Settings</h1>
            <button
              onClick={() => {
                window.history.back();
              }}
              className="px-4 py-2 bg-zinc-800 text-emerald-100 font-bold rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <ToggleSetting
              id="matchStarter"
              title="Match Starter"
              description="Enable manual start of matches"
              checked={isSettingsKey.matchStarter}
              onChange={(event) => {
                updateSetting("matchStarter", event.target.checked);
              }}
            />

            <ToggleSetting
              id="moveAutomatically"
              title="Move Automatically to Next Shift"
              description="Auto advance to next shift"
              checked={isSettingsKey.moveAutomaticallyToNextShift}
              onChange={(event) => {
                updateSetting(
                  "moveAutomaticallyToNextShift",
                  event.target.checked,
                );
              }}
            />

            <ToggleSetting
              id="startTimerOnSetPoint"
              title="Start Timer On Set Point"
              description="Automatically start timer when point is set"
              checked={isSettingsKey.startTimerOnSetPoint}
              onChange={(event) => {
                updateSetting(
                  "startTimerOnSetPoint",
                  event.target.checked,
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
