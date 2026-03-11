import React, { useEffect, useState } from "react";

const PRIORITY_STORAGE_KEY = "scouting-priority";

interface PriorityInputProps {
  matchId: string;
  teamNumber: number;
}

interface SavePriorityPayload {
  matchId: string;
  teamNumber: number;
  priority: number;
}

export const PriorityInput: React.FC<PriorityInputProps> = ({
  matchId,
  teamNumber,
}) => {
  const [priority, setPriority] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const savedValue = localStorage.getItem(
      `${PRIORITY_STORAGE_KEY}-${matchId}-${teamNumber}`,
    );

    if (!savedValue) return;

    const parsed = Number(savedValue);
    if (!Number.isNaN(parsed)) {
      setPriority(parsed);
    }
  }, [matchId, teamNumber]);

  useEffect(() => {
    const storageKey = `${PRIORITY_STORAGE_KEY}-${matchId}-${teamNumber}`;

    if (priority === "") {
      localStorage.removeItem(storageKey);
      return;
    }

    localStorage.setItem(storageKey, String(priority));
  }, [priority, matchId, teamNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setPriority("");
      return;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) return;

    setPriority(parsed);
  };

  const handleSubmit = async () => {
    if (priority === "") {
      setMessage("Please enter a priority first.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const payload: SavePriorityPayload = {
      matchId,
      teamNumber,
      priority,
    };

    try {
      const response = await fetch("/api/scouting/priority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save priority");
      }

      setMessage("Priority saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Error saving priority.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-green-700 bg-black/40 p-4">
      <label htmlFor="priority" className="text-sm font-medium text-green-100">
        Priority
      </label>

      <input
        id="priority"
        type="number"
        value={priority}
        onChange={handleChange}
        placeholder="Enter priority"
        className="rounded-lg border border-green-700 bg-gray-900 px-3 py-2 text-green-100 outline-none focus:border-green-500"
      />

      <button
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={isSubmitting}
        className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
          isSubmitting
            ? "cursor-not-allowed bg-gray-600"
            : "bg-green-700 hover:bg-green-600 active:bg-green-800"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save priority"}
      </button>

      {message && <p className="text-sm text-green-200">{message}</p>}
    </div>
  );
};