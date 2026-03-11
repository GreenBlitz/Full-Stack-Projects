import { number } from "io-ts";
import React, { useEffect, useState } from "react";

export interface TeamPriority {
  teamNumber: number;
  priority: number;
}
const priorityUrl = "/api/v1/priority/";

const fetchATeamPriority = async (
  teamNumber: number,
): Promise<TeamPriority> => {
  const params = new URLSearchParams({
    teamNumber: String(teamNumber),
  });

  const url = `${priorityUrl}?${params.toString()}`;
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

export const AllTeamsPriorities = async (): Promise<TeamPriority[]> => {
  const url = `${priorityUrl}`;
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
    return data.teamPriority as TeamPriority[];
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

const submitPriority = async (teamPriority: TeamPriority) => {
  try {
    const response = await fetch("/api/v1/priority", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamPriority),
    });
    if (response.ok) {
      console.log("sent successfully");
    }
  } catch (error: unknown) {
    alert(error);
  }
};

const PRIORITY_STORAGE_KEY = "scouting-priority";

interface PriorityInputProps {
  teamNumber: number;
}

interface SavePriorityPayload {
  teamNumber: number;
  priority: number;
}

export const EditPriority: React.FC<PriorityInputProps> = ({ teamNumber }) => {
  const [priority, setPriority] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  useEffect(() => {
    const savedValue = localStorage.getItem(
      `${PRIORITY_STORAGE_KEY}-${teamNumber}`,
    );

    if (!savedValue) return;

    const parsed = Number(savedValue);
    if (!Number.isNaN(parsed)) {
      setPriority(parsed);
    }
  }, [teamNumber]);

  useEffect(() => {
    const storageKey = `${PRIORITY_STORAGE_KEY}--${teamNumber}`;

    if (priority === "") {
      localStorage.removeItem(storageKey);
      return;
    }

    localStorage.setItem(storageKey, String(priority));
  }, [priority, teamNumber]);

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
      setFeedbackMessage("Please enter a priority first.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    const payload: SavePriorityPayload = {
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

      setFeedbackMessage("Priority saved successfully.");
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Error saving priority.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-green-700 bg-black/40 p-2 w-40">
      <label htmlFor="priority" className="text-xs font-medium text-green-100">
        Priority
      </label>

      <input
        id="priority"
        type="number"
        value={priority}
        onChange={handleChange}
        placeholder="Priority"
        className="rounded-md border border-green-700 bg-gray-900 px-2 py-1 text-xs text-green-100 outline-none focus:border-green-500"
      />

      <button
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={isSubmitting}
        className={`rounded-md px-2 py-1 text-xs font-semibold text-white transition ${
          isSubmitting
            ? "cursor-not-allowed bg-gray-600"
            : "bg-green-700 hover:bg-green-600 active:bg-green-800"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>

      {feedbackMessage && (
        <p className="text-[10px] text-green-200">{feedbackMessage}</p>
      )}
    </div>
  );
};
