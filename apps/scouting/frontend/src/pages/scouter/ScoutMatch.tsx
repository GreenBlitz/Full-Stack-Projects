// בס"ד
import { useMemo, type FC, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { ScoutingForm } from "@repo/scouting_types";

const TABS: Tab[] = [
  {
    name: "Pre Match",
    Component: () => <div className="p-4">Pre Match</div>,
  },
  { name: "Auto", Component: () => <div className="p-4">Auto Content</div> },
  {
    name: "Transition",
    Component: () => <div className="p-4">Transition Content</div>,
  },
  {
    name: "Teleop",
    Component: () => <div className="p-4">Teleop Content</div>,
  },
  {
    name: "Endgame",
    Component: () => <div className="p-4">Endgame Content</div>,
  },
  {
    name: "Post Match",
    Component: () => <div className="p-4">Post Match Content</div>,
  },
];

interface Tab {
  name: string;
  Component: FC<{ form: ScoutingForm }>;
}

const STARTING_TAB_INDEX = 0;
const MOVEMENT_AMOUNT = 1;
const ONE_ARRAY_ELEMENT = 1;

export const ScoutMatch: FC = () => {
  const [activeTabIndex, setActiveTab] = useLocalStorage<number>(
    "current_tab_index",
    STARTING_TAB_INDEX,
  );

  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTabIndex]);

  const currentTab = useMemo(() => TABS[activeTabIndex], [activeTabIndex]);

  const goToPrev = () => {
    setActiveTab((prev) => prev - MOVEMENT_AMOUNT);
  };
  const goToNext = () => {
    setActiveTab((prev) => prev + MOVEMENT_AMOUNT);
  };

  return (
    <div className="max-w-3xl min-h-max mx-auto mt-10 p-4 md:p-8 bg-slate-600 border border-slate-500 rounded-2xl shadow-sm overflow-hidden">
      <nav className="flex space-x-2 mb-8 border-b border-slate-500 pb-4 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar">
        {TABS.map((tab, index) => (
          <button
            key={index}
            // Attach the ref ONLY to the active element
            ref={activeTabIndex === index ? activeTabRef : null}
            onClick={() => {
              setActiveTab(index);
            }}
            className={`shrink-0 px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTabIndex === index
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-500 hover:text-white"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Dynamic Component Rendering */}
      <div className="min-h-[300px] text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
        <currentTab.Component form={} />
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={goToPrev}
          disabled={activeTabIndex === STARTING_TAB_INDEX}
          className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          ← Previous
        </button>

        <button
          onClick={goToNext}
          disabled={activeTabIndex === TABS.length - ONE_ARRAY_ELEMENT}
          className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
