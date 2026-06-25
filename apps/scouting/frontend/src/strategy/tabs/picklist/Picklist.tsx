import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

interface TeamData {
  id: string;
  teamNumber: number;
  teamName: string;
  avgPoints: number;
}

const INITIAL_TEAMS: TeamData[] = [
  {
    id: "team-4590",
    teamNumber: 4590,
    teamName: "GreenBlitz",
    avgPoints: 42.5,
  },
  { id: "team-1690", teamNumber: 1690, teamName: "Orbit", avgPoints: 48.2 },
  {
    id: "team-254",
    teamNumber: 254,
    teamName: "The Cheesy Poofs",
    avgPoints: 51.7,
  },
  {
    id: "team-118",
    teamNumber: 118,
    teamName: "The Robonauts",
    avgPoints: 39.4,
  },
  { id: "team-3339", teamNumber: 3339, teamName: "BumbleB", avgPoints: 36.1 },
];

export const Picklist: React.FC = () => {
  const [teams, setTeams] = useState<TeamData[]>(INITIAL_TEAMS);

  // This handles the state update when an item finishes moving
  const handleOnDragEnd = (result: DropResult) => {
    // If dropped outside a valid droppable area, do nothing
    if (!result.destination) return;

    const items = Array.from(teams);
    // Remove the dragged item from its original position
    const [reorderedItem] = items.splice(result.source.index, 1);
    // Insert the dragged item into its new destination position
    items.splice(result.destination.index, 0, reorderedItem);

    setTeams(items);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800">
      {/* Header bar mirroring the list table layout */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-2">Team No.</div>
        <div className="col-span-6">Team Name</div>
        <div className="col-span-3 text-right">Avg Points</div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="teams-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 mt-2"
            >
              {teams.map((team, index) => (
                <Draggable key={team.id} draggableId={team.id} index={index}>
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
                    >
                      {/* Dynamic rank based on array position */}
                      <div className="col-span-1 text-center font-mono font-bold text-slate-500">
                        {index + 1}
                      </div>

                      <div className="col-span-2 font-mono font-medium text-blue-400">
                        #{team.teamNumber}
                      </div>

                      <div className="col-span-6 font-semibold text-slate-200 truncate">
                        {team.teamName}
                      </div>

                      <div className="col-span-3 text-right font-mono font-bold text-emerald-400">
                        {team.avgPoints.toFixed(1)}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {/* Context placeholder to prevent layout shifting during drag */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
