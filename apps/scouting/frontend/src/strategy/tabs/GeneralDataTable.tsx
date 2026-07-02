// בס"ד
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type {
  ClimbLevel,
  GamePeriod,
  GeneralBeeData,
  GeneralData,
  GeneralTeamBeeData,
} from "@repo/scouting_types";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { mapObject } from "@repo/array-functions";

export type Column =
  | "Score Tele"
  | "Pass Tele"
  | "Score Auto"
  | "Pass Auto"
  | "Driving"
  | "Evasion Rating"
  | "Defense Rating"
  | "Times Defended"
  | "Times Evaded"
  | "Score Full"
  | "Pass Full"
  | "Climb Full";

type DataValue = ClimbLevel | number | undefined;

type DataAccessor = (row: GeneralTeamBeeData) => DataValue;
const columnToKey: Record<Column, DataAccessor> = {
  Driving: ({ super: { driving } }) => driving,
  "Defense Rating": ({ super: { defenseRating } }) => defenseRating,
  "Evasion Rating": ({ super: { evasionRating } }) => evasionRating,
  "Score Tele": ({ tele: { fuelScored } }) => fuelScored,
  "Pass Tele": ({ tele: { fuelPassed } }) => fuelPassed,
  "Score Auto": ({ auto: { fuelScored } }) => fuelScored,
  "Pass Auto": ({ auto: { fuelPassed } }) => fuelPassed,
  "Times Defended": ({ super: { timesDefended } }) => timesDefended,
  "Times Evaded": ({ super: { timesEvaded } }) => timesEvaded,
  "Score Full": ({ full: { fuelScored } }) => fuelScored,
  "Pass Full": ({ full: { fuelPassed } }) => fuelPassed,
  "Climb Full": ({ full: { climbPoints } }) => climbPoints,
};

const fetchGeneralData = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = `/api/v1/general/`;

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
    return data.generalData as GeneralBeeData;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

interface GeneralDataTableProps {
  filters: {};
}

const DIGITS_AFTER_DOT = 1;

export const GeneralDataTable: React.FC<GeneralDataTableProps> = ({
  filters,
}) => {
  const [allGeneralData, setAllGeneralData] = useState<GeneralBeeData>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetchGeneralData(filters).then(setAllGeneralData).catch(console.error);
  }, [filters]);

  const tableData = Object.values(
    mapObject(allGeneralData, (data, team) => ({
      ...data,
      team,
    })),
  );
  const columnHelper = createColumnHelper<GeneralTeamBeeData>();

  const createColumn = (headerAndId: Column, style: string) =>
    columnHelper.accessor((row) => columnToKey[headerAndId](row), {
      id: headerAndId,
      header: headerAndId,
      sortingFn: "alphanumeric",
      cell: (info) => {
        const value = info.getValue();

        const displayValue =
          typeof value === "number" ? value.toFixed(DIGITS_AFTER_DOT) : value;

        return <span className={style}>{displayValue}</span>;
      },
    });

  const columns = useMemo(
    () => [
      columnHelper.accessor("team", {
        header: "Team Number",
        cell: (info) => (
          <span className="font-black text-emerald-400">{info.getValue()}</span>
        ),
      }),
      createColumn("Score Full", "text-green-500"),
      createColumn("Score Auto", "text-blue-500"),
      createColumn("Defense Rating", "text-pink-500"),
      createColumn("Score Tele", "text-red-500"),
      createColumn("Pass Tele", "text-violet-500"),
      createColumn("Driving", "text-orange-500"),
      createColumn("Times Defended", "text-pink-200"),
      createColumn("Evasion Rating", "text-purple-500"),
      createColumn("Times Evaded", "text-purple-200"),
      createColumn("Climb Full", "text-purple-400 font-bold"),
      createColumn("Pass Auto", "text-violet-500"),
      createColumn("Pass Full", "text-green-200"),
    ],
    [sorting],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6 p-4 bg-slate-950 min-h-screen">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
        <table className="w-full min-w-max text-left text-sm border-collapse">
          <thead className="bg-slate-800/50 border-b border-white/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px] cursor-pointer select-none transition-colors hover:bg-slate-800"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <span className="text-emerald-500/50">
                        {header.column.getIsSorted() === "asc" ? (
                          <FaChevronUp size={12} strokeWidth={3} />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <FaChevronDown size={12} strokeWidth={3} />
                        ) : (
                          <HiOutlineChevronUpDown size={12} strokeWidth={2} />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => {
              console.log("data:", tableData, "columns:", columns);
              // for some reason these rows dont update unless
              //they reference the tableData in them
              return (
                <tr
                  key={row.id}
                  className="hover:bg-emerald-500/5 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
