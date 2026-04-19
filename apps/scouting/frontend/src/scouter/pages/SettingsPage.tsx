// בס"ד
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { isLeft } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";
import {
  competitions,
  decodeManualScheduleJson,
  type Competition,
  type ManualSchedulesByCompetition,
} from "@repo/scouting_types";
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

const defaultManualSchedules: ManualSchedulesByCompetition = {};

const scheduleExample = `[
  { "comp_level": "qm", "set_number": 1, "match_number": 1, "red": [254, 1678, 1323], "blue": [1114, 2056, 971] }
]`;

const SettingsPage: FC = () => {
  const [isSettingsKey, setSettingsKey] = useLocalStorage<SettingsKeyType>(
    "settings",
    defaultSettings,
  );
  const [manualSchedules, setManualSchedules] =
    useLocalStorage<ManualSchedulesByCompetition>(
      "manualMatchScheduleByCompetition",
      defaultManualSchedules,
    );

  const [scheduleCompetition, setScheduleCompetition] =
    useState<Competition>("TESTING");
  const [scheduleJsonDraft, setScheduleJsonDraft] = useState("");
  const [scheduleMessage, setScheduleMessage] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const loadedRows = manualSchedules[scheduleCompetition]?.length ?? 0;

  const hydrateDraftFromStorage = useCallback(() => {
    const rows = manualSchedules[scheduleCompetition];
    setScheduleJsonDraft(
      rows && rows.length > 0 ? JSON.stringify(rows, null, 2) : "",
    );
    setScheduleMessage(null);
  }, [manualSchedules, scheduleCompetition]);

  useEffect(() => {
    hydrateDraftFromStorage();
  }, [scheduleCompetition, manualSchedules, hydrateDraftFromStorage]);

  const updateSetting = (key: keyof SettingsKeyType, value: boolean) => {
    setSettingsKey((prev: SettingsKeyType) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveManualSchedule = () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(scheduleJsonDraft || "[]") as unknown;
    } catch {
      setScheduleMessage({
        kind: "err",
        text: "Invalid JSON — fix syntax and try again.",
      });
      return;
    }

    const decoded = decodeManualScheduleJson(parsed);
    if (isLeft(decoded)) {
      setScheduleMessage({
        kind: "err",
        text: PathReporter.report(decoded).join("\n"),
      });
      return;
    }

    setManualSchedules((prev) => ({
      ...prev,
      [scheduleCompetition]: decoded.right,
    }));
    setScheduleMessage({
      kind: "ok",
      text: `Saved ${decoded.right.length} match row(s) for ${scheduleCompetition}.`,
    });
  };

  const clearManualSchedule = () => {
    setManualSchedules((prev) => {
      const next = { ...prev };
      delete next[scheduleCompetition];
      return next;
    });
    setScheduleJsonDraft("");
    setScheduleMessage({
      kind: "ok",
      text: `Cleared manual schedule for ${scheduleCompetition}.`,
    });
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

          <div className="mt-10 pt-8 border-t border-zinc-700 space-y-3">
            <h2 className="text-xl font-semibold text-emerald-300">
              Manual match schedule
            </h2>
            <p className="text-sm text-zinc-400">
              Paste a JSON array of matches for the competition you scout in
              PreMatch. Each row uses TBA-style fields:{" "}
              <code className="text-zinc-300">comp_level</code> (qm, pc, sf, f,
              …), <code className="text-zinc-300">set_number</code>,{" "}
              <code className="text-zinc-300">match_number</code>, and{" "}
              <code className="text-zinc-300">red</code> /{" "}
              <code className="text-zinc-300">blue</code> as team numbers
              (close → middle → far). Manual rows override TBA for the same
              match when both exist.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-300" htmlFor="sched-comp">
                Competition (must match the scout form)
              </label>
              <select
                id="sched-comp"
                className="bg-zinc-800 text-emerald-100 rounded-lg px-3 py-2 border border-zinc-600"
                value={scheduleCompetition}
                onChange={(e) => {
                  setScheduleCompetition(e.target.value as Competition);
                }}
              >
                {competitions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-zinc-500">
              Stored rows for this competition: {loadedRows}
            </p>
            <textarea
              className="w-full min-h-48 font-mono text-sm bg-zinc-950 text-zinc-200 border border-zinc-600 rounded-lg p-3"
              spellCheck={false}
              placeholder={scheduleExample}
              value={scheduleJsonDraft}
              onChange={(e) => setScheduleJsonDraft(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveManualSchedule}
                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600"
              >
                Save schedule
              </button>
              <button
                type="button"
                onClick={clearManualSchedule}
                className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600"
              >
                Clear for this competition
              </button>
              <button
                type="button"
                onClick={hydrateDraftFromStorage}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
              >
                Reload from storage
              </button>
            </div>
            {scheduleMessage ? (
              <p
                className={
                  scheduleMessage.kind === "ok"
                    ? "text-emerald-400 text-sm whitespace-pre-wrap"
                    : "text-red-400 text-sm whitespace-pre-wrap"
                }
              >
                {scheduleMessage.text}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
