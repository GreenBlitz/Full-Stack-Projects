// בס"ד
import type React from "react";

interface HeaderProps {
  inputEventKey: string;
  onInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent) => void;
  searchStatus: "idle" | "searching" | "success" | "error";
}

export const Header: React.FC<HeaderProps> = ({
  inputEventKey,
  onInputChange,
  onSearchSubmit,
  searchStatus,
}) => {
  return (
    <div className="bg-slate-700 dark:bg-slate-800 py-5 text-white shadow-md">
      <div className="mx-auto max-w-4xl px-5">
        <h1 className="mb-4 text-center text-3xl font-normal">
          GB Playoff schedule
        </h1>
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="🔍Event ID (e.g., 2025isios)"
            value={inputEventKey}
            onChange={(event) => {
              onInputChange(event.target.value);
            }}
            className="search-input flex-1 rounded-md border-2 border-slate-400 dark:border-slate-500 bg-slate-600 dark:bg-slate-700 p-3 text-base text-white outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-400 focus:border-blue-400 dark:focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={searchStatus === "searching"}
            className="rounded-md bg-slate-500 dark:bg-slate-600 px-6 py-3 text-base font-bold text-white transition hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-70"
          >
            {searchStatus === "searching" ? "searching data" : "search"}
          </button>
        </form>

        {searchStatus === "error" && (
          <div className="mt-4 rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-800 dark:text-red-300">
            Event not found.
          </div>
        )}
      </div>
    </div>
  );
};
