// בס"ד
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { GameTime, TeamNumberAndFuelData } from "@repo/scouting_types";
import type React from "react";
import { useState, useEffect } from "react";

const fetchFuelData = async (filters = {}) => {
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
    return data.calculatedFuel as TeamNumberAndFuelData[];
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

interface GeneralDataTableProps {
  filters: {};
}

const DIGITS_AFTER_DOT = 1;

const GeneralDataTable: React.FC<GeneralDataTableProps> = ({ filters }) => {
  const [data, setData] = useState<TeamNumberAndFuelData[]>([]);
  const [gameTime, setGameTime] = useState<GameTime>("tele");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetchFuelData(filters).catch(console.error);
  }, [filters]);

  const columnHelper = createColumnHelper<TeamNumberAndFuelData>();

  const columns = [
    columnHelper.accessor("teamNumber", {
      header: "Team Number",
      cell: (info) => (
        <span className="font-bold text-blue-600">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor((row) => row.generalFuelData[gameTime].shot, {
      id: "shot",
      header: "Shot",
      cell: (info) => info.getValue().toFixed(DIGITS_AFTER_DOT),
    }),
    columnHelper.accessor((row) => row.generalFuelData[gameTime].scored, {
      id: "scored",
      header: "Scored",
      cell: (info) => info.getValue().toFixed(DIGITS_AFTER_DOT),
    }),
    columnHelper.accessor(
      (row) => {
        const stats = row.generalFuelData[gameTime];
        return stats.shot - stats.scored;
      },
      {
        id: "missed",
        header: "Missed",
        cell: (info) => (
          <span className="text-red-500">
            {info.getValue().toFixed(DIGITS_AFTER_DOT)}
          </span>
        ),
      },
    ),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2 justify-center bg-gray-100 p-2 rounded-lg">
        {(["auto", "tele", "fullGame"] as GameTime[]).map((time) => (
          <button
            key={time}
            onClick={() => {
              setGameTime(time);
            }}
            className={`px-4 py-2 rounded-md transition-all ${
              gameTime === time
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: "ascending",
                        desc: "descending",
                      }[header.column.getIsSorted() as string] ?? "sort"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralDataTable;
