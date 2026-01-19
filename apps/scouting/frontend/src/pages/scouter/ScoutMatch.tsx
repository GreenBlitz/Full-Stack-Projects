// בס"ד
import {
  useMemo,
  type FC,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { defaultScoutForm, type ScoutingForm } from "@repo/scouting_types";

interface Tab {
  name: string;
  Component: FC<{ setForm: SetStateAction<Dispatch<ScoutingForm>> }>;
}
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

const STARTING_TAB_INDEX = 0;
const MOVEMENT_AMOUNT = 1;
const ONE_ARRAY_ELEMENT = 1;

const createNewScoutingForm = () => structuredClone(defaultScoutForm);

export const ScoutMatch = () => {
  const [scoutingForm, setScoutingForm] = useState(createNewScoutingForm());
  const [activeTabIndex, setActiveTab] = useState(STARTING_TAB_INDEX);

  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll logic - center the active tab
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
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
    <div className="max-h-screen bg-black p-4 md:p-6 flex items-center justify-center">
      <div className="flex flex-row max-w-5xl w-full mx-auto bg-gradient-to-br from-black via-gray-900 to-black border-2 border-green-500 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] gap-6 overflow-hidden h-[90vh] relative">
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>

        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 pointer-events-none"></div>

        {/* Sidebar/Navbar Navigation */}
        <nav
          className="
          relative z-10
          flex flex-col 
          gap-2 
          overflow-y-auto 
          scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-green-900/20
          border-r-2 
          border-green-500/30
          pr-4
          p-4
          min-w-[180px]
          max-h-[400px]
          bg-black/40
          
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
                shrink-0 flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-left relative overflow-hidden group
                ${
                  activeTabIndex === index
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)] scale-105 translate-x-2"
                    : "text-green-400 hover:bg-green-950 hover:text-green-300 border border-green-500/20 hover:border-green-500/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                }
              `}
            >
              {/* Animated background for inactive tabs on hover */}
              {activeTabIndex !== index && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              )}

              <span className="relative z-10 mr-3 opacity-70 font-mono">
                {String(index + ONE_ARRAY_ELEMENT)}
              </span>
              <span className="relative z-10">{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 relative z-10">
          <div className="flex-1 text-green-100 overflow-y-auto pr-2 bg-black/40 rounded-xl p-6 border border-green-500/20 shadow-inner animate-in fade-in slide-in-from-right-4 duration-300">
            <CurrentTab setForm={setScoutingForm} />
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between mt-4 pt-4 border-t-2 border-green-500/30 bg-black/40 rounded-xl p-4">
            <button
              onClick={goToPrev}
              disabled={activeTabIndex === STARTING_TAB_INDEX}
              className="px-6 py-2.5 text-sm font-bold text-black bg-gradient-to-r from-green-400 to-green-500 rounded-xl hover:from-green-500 hover:to-green-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] disabled:shadow-none border border-green-600"
            >
              ← Previous
            </button>

            <div className="hidden sm:flex items-center gap-2 text-green-400 text-xs self-center uppercase tracking-widest font-mono">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/50 text-green-300 font-bold">
                {activeTabIndex + ONE_ARRAY_ELEMENT}
              </span>
              <span className="opacity-60">OF</span>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                {TABS.length}
              </span>
            </div>

            <button
              onClick={goToNext}
              disabled={activeTabIndex === TABS.length - ONE_ARRAY_ELEMENT}
              className="px-8 py-2.5 text-sm font-bold text-black bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 border border-green-700"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
