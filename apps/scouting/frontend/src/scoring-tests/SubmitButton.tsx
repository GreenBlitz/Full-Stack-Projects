// בס"ד

import type { Test } from "../../../common/types/Tests";
import type { FC } from "react";

export const SubmitButton: FC<{ test: Test }> = ({ test }) => {
  return (
    <button
      type="submit"
      onClick={() => {
        fetch("/api/v1/tests/match", {
          method: "POST",
          body: JSON.stringify(test),
        }).catch((error: unknown) => {
          alert(error);
        });
      }}
      className="group relative flex w-80 mx-auto items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>Submit</span>
      {/* Optional: Subtle arrow icon that moves on hover */}
      <svg
        className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  );
};
