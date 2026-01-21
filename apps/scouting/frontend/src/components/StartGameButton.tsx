// בס"ד
import { useState, type FC } from "react";

interface StartGameButtonProps {
  matchNumber: number;
  matchType: "qualification" | "playoff" | "practice";
}

const MIN_MATCH_NUMBER = 1;

interface ErrorResponse {
  error?: string;
}

const EMPTY_OBJECT_KEY_COUNT = 0;

const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return typeof data === "object" && data !== null && ("error" in data || Object.keys(data).length === EMPTY_OBJECT_KEY_COUNT);
};

const StartGameButton: FC<StartGameButtonProps> = ({ matchNumber, matchType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleStartGame = async () => {
    if (!matchNumber || matchNumber < MIN_MATCH_NUMBER) {
      setMessage("Please enter a valid match number before starting the game");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/v1/game/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchNumber,
          matchType,
          startTime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data: unknown = await response.json();
        const errorData = isErrorResponse(data) ? data : { error: undefined };
        throw new Error(errorData.error ?? "Failed to start game");
      }
      setMessage("Game started successfully");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error starting game"
      );
      console.error("Error starting game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !matchNumber || matchNumber < MIN_MATCH_NUMBER;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => { void handleStartGame(); }}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        } text-white`}
      >
        {isLoading ? "Starting game..." : "Start game"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default StartGameButton;
