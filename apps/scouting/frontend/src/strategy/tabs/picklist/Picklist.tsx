import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { ListItem } from "./ListItem";
import type {
  DataPicklistBee,
  GeneralTeamBeeData,
  PicklistBee,
} from "@repo/scouting_types";
import { getTeamName } from "@repo/frc";
import { useLocalStorage } from "@repo/local_storage_hook";
import { isEmpty } from "@repo/array-functions";

export interface TeamListData {
  teamNumber: number;
  teamName: string;
  avgFuel: number;
}

const PICKLIST_URL = "/api/v1/picklist/list";
const fetchPicklist = async (
  name: string,
  withAlerts?: boolean,
): Promise<TeamListData[] | undefined> => {
  const response = await fetch(`${PICKLIST_URL}/${name}`);

  if (!response.ok) {
    withAlerts && alert(`Could not load branch ${name}`);
    return;
  }
  withAlerts && alert(`Loaded branch ${name}`);

  const data: DataPicklistBee = await response.json();

  return data.list.map(({ team, full: { fuelScored } }) => ({
    teamNumber: parseInt(team),
    teamName: getTeamName(parseInt(team)),
    avgFuel: fuelScored,
  }));
};

const PICKLISTS_URL = "/api/v1/picklist/lists";

const fetchBranches = async () => {
  const response = await fetch(PICKLISTS_URL);

  if (!response.ok) {
    return [];
  }
  const data: string[] = await response.json();

  return data;
};

const savePicklist = async (name: string, list: string[]) => {
  const picklist: PicklistBee = { name, list };
  const response = await fetch(PICKLIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(picklist),
  });

  if (response.ok) {
    alert("Saved!");
    return;
  }
  alert(`Couldnt Save! ${await response.text()}`);
};

export const Picklist: React.FC = () => {
  const [teams, setTeams] = useLocalStorage<TeamListData[]>(
    "picklist/teams",
    [],
  );
  const [branch, setBranch] = useLocalStorage("picklist/branch", "master");
  const [allBranches, setAllBranches] = useState<string[]>([]);

  const loadBranch = async (name: string, withAlerts?: boolean) => {
    const newTeams = await fetchPicklist(name, withAlerts);
    setTeams(newTeams ?? teams);
    setBranch(name);
  };
  useEffect(() => {
    if (isEmpty(teams)) {
      loadBranch(branch);
    }
    fetchBranches().then(setAllBranches);
  }, []);

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
      {/* Controls Container Group */}
      <div className="p-4 mb-6 bg-slate-800/40 border border-slate-800 rounded-lg space-y-4">
        {/* Row 1: Input and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
          <div className="w-full sm:w-auto flex-1">
            <label
              htmlFor="branch-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
            >
              Branch Name
            </label>
            <input
              id="branch-input"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value.toLowerCase())}
              placeholder="e.g., playoff-predictions"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => loadBranch(branch, true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 border border-slate-700 text-sm font-medium rounded-md transition-colors"
            >
              Load
            </button>
            <button
              onClick={() =>
                savePicklist(
                  branch,
                  teams.map(({ teamNumber }) => teamNumber.toString()),
                )
              }
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Row 2: Quick Select Branch (Now sitting cleanly underneath the first row) */}
        <div className="border-t border-slate-800/60 pt-3">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Quick Select Branch
          </span>
          <div className="flex flex-wrap gap-2">
            {allBranches.map((branchName) => {
              const isActive = branch === branchName;
              return (
                <button
                  key={branchName}
                  onClick={() => loadBranch(branchName)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                    isActive
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 font-semibold"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {branchName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
