// בס"ד
import { useState, type FC } from "react";

const BROKE_URL = "/api/v1/teamPage/broke";

const sendRobotBroke = async (
  teamNumber: number,
  matchNumber: number,
  robotBroke: boolean,
) => {
  const response = await fetch(`${BROKE_URL}/${teamNumber}/${matchNumber}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ robotBroke }),
  });

  if (response.ok) {
    alert(
      `Team ${teamNumber}, match ${matchNumber}: marked as ${
        robotBroke ? "broke" : "didn't break"
      }`,
    );
  } else {
    alert(`Couldn't update! ${await response.text()}`);
  }
};

const inputClass =
  "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5";

export const RobotBrokePage: FC = () => {
  const [teamNumber, setTeamNumber] = useState("");
  const [matchNumber, setMatchNumber] = useState("");
  const [robotBroke, setRobotBroke] = useState(false);
  const [sending, setSending] = useState(false);

  const canSubmit =
    Number.isInteger(Number(teamNumber)) &&
    Number.isInteger(Number(matchNumber)) &&
    teamNumber !== "" &&
    matchNumber !== "";

  const submit = async () => {
    if (!canSubmit) {
      alert(
        "you have to submit numbers as the team number and match number! fix it and try again.",
      );
      return;
    }
    setSending(true);
    try {
      await sendRobotBroke(Number(teamNumber), Number(matchNumber), robotBroke);
    } catch (error) {
      alert(`Couldn't update! ${error}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 px-4 py-6 w-full">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-number" className={labelClass}>
              Team Number
            </label>
            <input
              id="team-number"
              type="number"
              inputMode="numeric"
              value={teamNumber}
              onChange={(e) => setTeamNumber(e.target.value)}
              placeholder="e.g., 4590"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="match-number" className={labelClass}>
              Match Number
            </label>
            <input
              id="match-number"
              type="number"
              inputMode="numeric"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
              placeholder="e.g., 12"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={robotBroke}
          onClick={() => setRobotBroke((current) => !current)}
          className={`w-full py-6 rounded-2xl border text-lg font-bold uppercase tracking-wider transition-colors ${
            robotBroke
              ? "bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
              : "bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30"
          }`}
        >
          {robotBroke ? "Robot broke" : "Robot didn't break"}
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || sending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium rounded-md shadow-sm transition-colors"
        >
          {sending ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};
