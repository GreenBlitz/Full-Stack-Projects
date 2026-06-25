import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { ListItem } from "./ListItem";
import type { DataPicklistBee, GeneralTeamBeeData } from "@repo/scouting_types";
import { getTeamName } from "@repo/frc";
import { useLocalStorage } from "@repo/local_storage_hook";

export interface TeamListData {
  teamNumber: number;
  teamName: string;
  avgFuel: number;
}

const PICKLIST_URL = "/api/v1/picklist/list";
async function fetchPicklist(name: string): Promise<TeamListData[]> {
  const response = await fetch(`${PICKLIST_URL}/${name}`);

  const data: DataPicklistBee = await response.json();

  return data.list.map(({ team, full: { fuelScored } }) => ({
    teamNumber: parseInt(team),
    teamName: getTeamName(parseInt(team)),
    avgFuel: fuelScored,
  }));
}

export const Picklist: React.FC = () => {
  const [teams, setTeams] = useState<TeamListData[]>([]);
  const [branch, setBranch] = useLocalStorage("picklist/branch", "master");

  useEffect(() => {
    fetchPicklist(branch).then(setTeams);
  }, [branch]);

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
                <ListItem team={team} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
