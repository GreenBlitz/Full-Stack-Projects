// בס"ד

import type { FC } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { ScoreMethod } from "../../../common/types/Tests";

export const BasicData: FC<{
  setName: (name: string) => void;
  setMatch: (num: number) => void;
  setMethod: (method: ScoreMethod) => void;
}> = ({ setName, setMatch, setMethod }) => {
  return (
    <div className="flex flex-col gap-4 p-6 w-max-sm items-center">
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Method</label>
        <div className="relative">
          <select
            onChange={(event) => {
              setMethod(event.target.value as ScoreMethod);
            }}
            className="w-full appearance-none rounded-lg border border-slate-300 bg-[#242424] px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="bpm">BPM</option>
            <option value="drag">Drag</option>
            <option value="time">Time</option>
            <option value="button">Button</option>
          </select>

          {/* Custom Chevron Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
