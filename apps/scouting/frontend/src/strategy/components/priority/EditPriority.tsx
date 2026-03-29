import React, { useEffect, useState } from "react";

export interface TeamPriority {
  teamNumber: number;
  priority: number;
}

const priorityUrl = "/api/v1/priority";

export const fetchATeamPriority = async (
  teamNumber: number,
): Promise<TeamPriority> => {
  const url = `${priorityUrl}/${teamNumber}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data.teamPriority as TeamPriority;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

export const submitPriority = async (
  teamPriority: TeamPriority,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(priorityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamPriority),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const data = await response.json();
    return data as { message: string };
  } catch (err) {
    console.error("Submit failed:", err);
    throw err;
  }
};

const PRIORITY_STORAGE_KEY = "priority";

interface EditPriorityProps {
  teamNumber: number;
  initialPriority?: number | null;
  onSaved?: (savedPriority: TeamPriority) => void;
  onCancel?: () => void;
}

export const EditPriority: React.FC<EditPriorityProps> = ({
  teamNumber,
  initialPriority,
  onSaved,
  onCancel,
}) => {
  const [priority, setPriority] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  useEffect(() => {
    if (typeof initialPriority === "number") {
      setPriority(initialPriority);
      return;
    }

    const savedValue = localStorage.getItem(
      `${PRIORITY_STORAGE_KEY}-${teamNumber}`,
    );

    if (!savedValue) {
      return;
    }

    const parsed = Number(savedValue);
    if (!Number.isNaN(parsed)) {
      setPriority(parsed);
    }
  }, [teamNumber, initialPriority]);

  useEffect(() => {
    if (!Number.isFinite(teamNumber)) return;

    const storageKey = `${PRIORITY_STORAGE_KEY}-${teamNumber}`;

    if (priority === undefined) {
      localStorage.removeItem(storageKey);
      return;
    }

    localStorage.setItem(storageKey, String(priority));
  }, [priority, teamNumber]);


  const handleSubmit = async () => {
    if (!Number.isFinite(teamNumber)) {
      setFeedbackMessage("Select a valid team first.");
      return;
    }

    if (priority === undefined) {
      setFeedbackMessage("Please enter a priority first.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      await submitPriority({
        teamNumber,
        priority,
      });

      setFeedbackMessage("Priority saved successfully.");
      onSaved?.({ teamNumber, priority });
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Error saving priority.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        w-52 p-4
        flex flex-col gap-3
        bg-slate-900/40 backdrop-blur-md
        border border-white/10
        rounded-3xl shadow-2xl
      "
    >
      <label
        htmlFor="priority"
        className="text-xs font-black tracking-[0.2em] uppercase text-slate-400"
      >
        Edit Priority
      </label>

      <select
        id="priority"
        value={priority === undefined ? undefined : String(priority)}
        onChange={(e) => {
          const value = e.target.value;
          setPriority(value === undefined ? undefined : Number(value));
        }}
        className="
          w-full min-h-[44px]
          rounded-2xl
          border border-white/10
          bg-slate-950/70
          px-4 py-2
          text-sm font-semibold text-white
          outline-none
          transition
          focus:border-emerald-400/70
          focus:ring-2 focus:ring-emerald-500/20
        "
      >
        <option value="" disabled>
          Select priority
        </option>
        {Array.from({ length: 11 }, (_, i) => i).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            void handleSubmit();
          }}
          disabled={isSubmitting}
          className={`
            flex-1 min-h-[44px]
            rounded-2xl
            px-4 py-2
            text-sm font-black tracking-wide text-white
            transition
            ${
              isSubmitting
                ? "cursor-not-allowed bg-slate-700/70 border border-white/10"
                : "bg-emerald-600/90 hover:bg-emerald-500 active:bg-emerald-700 shadow-lg"
            }
          `}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="
              min-h-[44px]
              rounded-2xl
              px-4 py-2
              text-sm font-black tracking-wide text-white
              transition
              border border-white/10
              bg-slate-800/70
              hover:bg-slate-700/70
            "
          >
            Cancel
          </button>
        ) : null}
      </div>

      {feedbackMessage ? (
        <p
          className={`text-xs text-center ${
            feedbackMessage.toLowerCase().includes("error")
              ? "text-red-300"
              : "text-slate-400"
          }`}
        >
          {feedbackMessage}
        </p>
      ) : (
        <p className="text-[11px] text-slate-500 text-center">
          Save a custom team priority
        </p>
      )}
    </div>
  );
};
