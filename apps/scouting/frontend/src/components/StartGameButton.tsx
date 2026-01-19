// בס"ד
import { useState, type FC } from "react";

interface StartGameButtonProps {
  qual: string;
}

const StartGameButton: FC<StartGameButtonProps> = ({ qual }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleStartGame = async () => {
    if (!qual.trim()) {
      setMessage("Please enter a qual number before starting the game");
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
          qual: qual.trim(),
          startTime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
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

  const isDisabled = isLoading || !qual.trim();

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
