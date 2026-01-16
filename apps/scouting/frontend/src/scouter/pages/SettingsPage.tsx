// בס"ד
import type { FC, ChangeEvent } from "react";
import { useLocalStorage } from "@repo/local_storage_hook";
import ToggleSetting from "../components/ToggleSetting";

interface SettingsKeyType {
  matchStarter: boolean;
  moveAutomaticallyToNextShift: boolean;
}

const defaultSettings: SettingsKeyType = {
  matchStarter: false,
  moveAutomaticallyToNextShift: true,
};

const SettingsPage: FC = () => {
  const [issettingsKey, setSettingsKey] = useLocalStorage<SettingsKeyType>(
    "settings",
    defaultSettings
  );

  const updateSetting = (key: keyof SettingsKeyType, value: boolean) => {
    setSettingsKey((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

          <div className="space-y-4">
            <ToggleSetting
              id="matchStarter"
              title="Match Starter"
              description="Enable manual start of matches"
              checked={issettingsKey.matchStarter}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                updateSetting("matchStarter", event.target.checked);
              }}
            />

            <ToggleSetting
              id="moveAutomatically"
              title="Move Automatically to Next Shift"
              description="Auto advance to next shift"
              checked={issettingsKey.moveAutomaticallyToNextShift}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                updateSetting(
                  "moveAutomaticallyToNextShift",
                  event.target.checked
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
