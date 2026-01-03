// בס"ד
import type React from "react";

interface EventInfoBarProps {
  eventKey: string;
  teamCount: number;
}

export const EventInfoBar: React.FC<EventInfoBarProps> = ({
  eventKey,
  teamCount,
}) => {
  return (
    <div className="mb-5 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>
        <strong>Event:</strong> {eventKey}
      </span>
      <span>
        <strong>Teams:</strong> {teamCount}
      </span>
    </div>
  );
};
