// בס"ד
import { useState, type FC } from "react";

interface StartGameButtonProps {
  qual: string;
}

const StartGameButton: FC<StartGameButtonProps> = ({ qual }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4590";

  const handleStartGame = async () => {
    if (!qual.trim()) {
      setMessage("אנא הכנס מספר קוואל לפני התחלת המשחק");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/api/v1/game/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qual: qual.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to start game");
      }

      const data = await response.json();
      const currentTime = new Date(data.startTime).toLocaleString("he-IL");
      setMessage(`משחק התחיל בהצלחה! Qual: ${qual.trim()}, זמן: ${currentTime}`);
      console.log("Game started:", data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `שגיאה: ${error.message}`
          : "שגיאה בהתחלת המשחק"
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
        {isLoading ? "מתחיל משחק..." : "התחל משחק"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("שגיאה") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default StartGameButton;
