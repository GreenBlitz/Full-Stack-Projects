import { Draggable } from "@hello-pangea/dnd";
import type { FC } from "react";
import type { TeamListData } from "./Picklist";

export const ListItem: FC<{ team: TeamListData; index: number }> = ({
  team,
  index,
}) => (
  <Draggable
    key={team.teamNumber}
    draggableId={team.teamNumber.toString()}
    index={index}
  >
    {(provided, snapshot) => (
      <div
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className={`grid grid-cols-12 gap-4 items-center px-4 py-3 bg-slate-800/60 border rounded-lg transition-colors cursor-grab active:cursor-grabbing ${
    snapshot.isDragging
      ? "border-blue-500 bg-slate-700 shadow-xl scale-[1.01]"
      : "border-slate-800 hover:border-slate-700 hover:bg-slate-800"
  }`}
  style={provided.draggableProps.style as React.CSSProperties}
>
        {/* Dynamic rank based on array position */}
        <div className="col-span-1 text-center font-mono font-bold text-slate-500">
          {index + 1}
        </div>

        <div className="col-span-2 font-mono font-medium text-blue-400">
          {team.teamNumber}
        </div>

        <div className="col-span-6 font-semibold text-slate-200 truncate">
          {team.teamName}
        </div>

        <div className="col-span-3 text-right font-mono font-bold text-emerald-400">
          {team.avgFuel.toFixed(1)}
        </div>
      </div>
    )}
  </Draggable>
);
