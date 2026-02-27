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
  FuelEvents,
  GameTime,
  GeneralData,
  GeneralFuelData,
  TeamNumberAndFuelData,
} from "@repo/scouting_types";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

interface TableRow {
  teamNumber: number;
  generalFuelData: GeneralFuelData;
}

export type Column = FuelEvents | "climb" | "max climb";

type DataValue = ClimbLevel | number | undefined;

type DataAccessor = (row: GeneralData, gameTime: GameTime) => DataValue;
const columnToKey: Record<Column, DataAccessor> = {
  scored: (row, gameTime) => row.fuelData[gameTime].scored,
  shot: (row, gameTime) => row.fuelData[gameTime].shot,
  missed: (row, gameTime) => row.fuelData[gameTime].missed,
  passed: (row, gameTime) => row.fuelData[gameTime].passed,
  climb: (row, gameTime) => row.avarageClimbPoints[gameTime],
  "max climb": (row) => row.highestClimbLevel,
};

const fetchGeneralData = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = `/api/v1/general/?${params.toString()}`;

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
    return data.generalData as GeneralData[];
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
  const [allGeneralData, setAllGeneralData] = useState<GeneralData[]>([]);
  const [gameTime, setGameTime] = useState<GameTime>("tele");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetchGeneralData(filters).then(setAllGeneralData).catch(console.error);
  }, [filters]);

  const tableData = useMemo(
    () =>
      allGeneralData.map((generalData) => ({
        ...generalData,
        _uiKey: gameTime,
      })),
    [allGeneralData, gameTime],
  );

  const columnHelper = createColumnHelper<GeneralData>();

  const createColumn = (headerAndId: Column, style: string) =>
    columnHelper.accessor((row) => columnToKey[headerAndId](row, gameTime), {
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
      columnHelper.accessor("teamNumber", {
        header: "Team Number",
        cell: (info) => (
          <span className="font-black text-emerald-400">{info.getValue()}</span>
        ),
      }),

      createColumn("scored", "text-emerald-400 font-bold"),
      createColumn("missed", "text-rose-500/90 font-medium"),
      createColumn("passed", "text-orange-400 font-medium"),
      createColumn("climb", "text-purple-400 font-bold"),
      createColumn("max climb", "text-slate-400 uppercase text-[10px]"),
    ],
    [gameTime, sorting],
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
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
        <div className="flex gap-1.5 justify-center bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 self-center">
          {(["auto", "tele", "fullGame"] as GameTime[]).map((time) => (
            <button
              key={time}
              onClick={() => {
                setGameTime(time);
              }}
              className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                gameTime === time
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <table className="w-full text-left text-sm border-collapse">
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
