// בס"ד
import {
  useMemo,
  type FC,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { defaultScoutForm, type ScoutingForm } from "@repo/scouting_types";

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
    name: "Shift1",
    Component: () => <div className="p-4">Shift1 Content</div>,
  },
  {
    name: "Shift2",
    Component: () => <div className="p-4">Shift2 Content</div>,
  },
  {
    name: "Shift3",
    Component: () => <div className="p-4">Shift3 Content</div>,
  },
  {
    name: "Shift4",
    Component: () => <div className="p-4">Shift4 Content</div>,
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
  Component: FC<{ setForm: SetStateAction<Dispatch<ScoutingForm>> }>;
}

const STARTING_TAB_INDEX = 0;
const MOVEMENT_AMOUNT = 1;
const ONE_ARRAY_ELEMENT = 1;

const blackBlitz = "#1a1a1a";
const greenBlitz = "#52ae35";

const createNewScoutingForm = () => structuredClone(defaultScoutForm);

export const ScoutMatch: FC = () => {
  const [scoutingForm, setScoutingForm] = useLocalStorage<ScoutingForm>(
    "scouting_form",
    createNewScoutingForm(),
  );
  const [activeTabIndex, setActiveTab] = useLocalStorage<number>(
    "current_tab_index",
    STARTING_TAB_INDEX,
  );

  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Vertical behavior (Desktop)
        inline: "center", // Horizontal behavior (Mobile)
      });
    }
  }, [activeTabIndex]);

  const CurrentTab = useMemo(
    () => TABS[activeTabIndex].Component,
    [activeTabIndex],
  );

  const goToPrev = () => {
    setActiveTab((prev) => prev - MOVEMENT_AMOUNT);
  };
  const goToNext = () => {
    setActiveTab((prev) => prev + MOVEMENT_AMOUNT);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto mt-5 p-4 md:p-6 bg-slate-700 border border-slate-800 rounded-2xl shadow-xl gap-6 overflow-hidden h-[90vh] md:h-auto">
      {/* Sidebar/Navbar Navigation */}
      <nav
        className="
        flex flex-row md:flex-col 
        gap-2 
        overflow-x-auto md:overflow-y-auto 
        whitespace-nowrap 
        scrollbar-hide
        border-b md:border-b-0 md:border-r 
        border-slate-500 
        pb-4 md:pb-0 md:pr-4 
        max-h-[200px]
        min-w-[150px]
        snap-x
      "
      >
        {TABS.map((tab, index) => (
          <button
            key={index}
            ref={activeTabIndex === index ? activeTabRef : null}
            onClick={() => {
              setActiveTab(index);
            }}
            className={`
              shrink-0 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left snap-center
              ${
                activeTabIndex === index
                  ? "bg-indigo-600 text-white shadow-lg md:translate-x-1"
                  : "text-slate-400 hover:bg-slate-500 hover:text-white"
              }
            `}
          >
            <span className="mr-3 opacity-50">{index + ONE_ARRAY_ELEMENT}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 text-white overflow-y-auto pr-2 animate-in fade-in slide-in-from-right-4 duration-300">
          <CurrentTab setForm={setScoutingForm} />
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between mt-4 pt-4 border-t border-slate-500 bg-slate-600">
          <button
            onClick={goToPrev}
            disabled={activeTabIndex === STARTING_TAB_INDEX}
            className="px-6 py-2.5 text-sm font-medium text-white bg-white rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all"
          >
            ← Previous
          </button>

          <div className="hidden sm:block text-slate-400 text-xs self-center uppercase tracking-widest">
            Step {activeTabIndex + ONE_ARRAY_ELEMENT} of {TABS.length}
          </div>

          <button
            onClick={goToNext}
            disabled={activeTabIndex === TABS.length - ONE_ARRAY_ELEMENT}
            className="px-8 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
