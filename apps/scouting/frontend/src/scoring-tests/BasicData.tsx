// בס"ד

import type { FC } from "react";
import { useLocalStorage } from "./useLocalStorage";

const defaultMatch = 1;
export const BasicData: FC<{
  setName: (name: string) => void;
  setMatch: (num: number) => void;
}> = ({ setName, setMatch }) => {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm">
      {/* Name Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.currentTarget.value);
          }}
          placeholder="Enter name here"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
        />
      </div>

      {/* Match Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Match</label>
        <input
          type="number"
          onChange={(event) => {
            setMatch(Number(event.currentTarget.value));
          }}
          placeholder="0"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};
