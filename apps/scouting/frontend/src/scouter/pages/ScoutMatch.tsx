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
  Component: FC<{ setForm: Dispatch<SetStateAction<ScoutingForm>> }>;
}
const TABS: Tab[] = [
  {
    name: "Pre",
    Component: () => <div className="p-4">Pre Match</div>,
  },
  { name: "Auto", Component: () => <div className="p-4">Auto Content</div> },
  {
    name: "Trans",
    Component: () => <div className="p-4">Transition Content</div>,
  },
  {
    name: "Tele",
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
    name: "Post",
    Component: () => <div className="p-4">Post Match Content</div>,
  },
];

interface SideBarProps {
  setActiveTab: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
}

const ONE_ARRAY_ELEMENT = 1;
const MOVEMENT_AMOUNT = 1;
const STARTING_TAB_INDEX = 0;

const SideBar: FC<SideBarProps> = ({ setActiveTab, activeTabIndex }) => {
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const goToPrev = () => {
    setActiveTab((prev) => prev - MOVEMENT_AMOUNT);
  };
  const goToNext = () => {
    setActiveTab((prev) => prev + MOVEMENT_AMOUNT);
  };

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeTabIndex]);

  return (
    <div className="relative flex flex-col pr-1 p-4 max-w-37.5 max-h-screen">
      <div className="flex flex-row">
        <button className="w-12 text-sm [writing-mode:vertical-rl] [text-orientation:upright]">
          
        </button>
        <button
          onClick={goToPrev}
          disabled={activeTabIndex === STARTING_TAB_INDEX}
          className="scouter-navigation-button"
        >
          ⬆<br /> Prev
        </button>
      </div>
      <nav
        className="
          gap-2 
          overflow-y-auto 
          scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-green-900/20
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
                shrink-0 flex w-full py-3 font-bold rounded-xl
                transition-all duration-300 text-left relative overflow-hidden group
                ${
                  activeTabIndex === index
                    ? "highlighted-tab"
                    : "unhighlighted-tab"
                }
              `}
          >
            <span className="relative z-10 mr-3 opacity-70 font-mono">
              {String(index + ONE_ARRAY_ELEMENT)}
            </span>
            <span className="relative z-10">{tab.name}</span>
          </button>
        ))}
      </nav>
      <button
        onClick={goToNext}
        disabled={activeTabIndex === TABS.length - ONE_ARRAY_ELEMENT}
        className="scouter-navigation-button"
      >
        Next <br />⬇
      </button>
    </div>
  );
};

const createNewScoutingForm = () => structuredClone(defaultScoutForm);

export const ScoutMatch: FC = () => {
  const [scoutingForm, setScoutingForm] = useState(createNewScoutingForm());
  const [activeTabIndex, setActiveTab] = useState(STARTING_TAB_INDEX);

  const CurrentTab = useMemo(
    () => TABS[activeTabIndex].Component,
    [activeTabIndex],
  );

  return (
    <div
      className="max-h-screen bg-black p-4 md:p-6 flex items-center justify-center
      force-landscape"
    >
      <div
        className="flex flex-row max-w-5xl w-full mx-auto bg-linear-to-br
       from-black via-gray-900 to-black border-2 border-green-500 
       rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] overflow-hidden h-[90vh] relative"
      >
        <SideBar setActiveTab={setActiveTab} activeTabIndex={activeTabIndex} />

        <div className="flex-1 flex flex-col overflow-hidden p-2 relative z-10">
          <div
            className="flex-1 text-green-100 overflow-y-auto pr-2
           bg-black/40 rounded-xl p-6 border border-green-500/20 shadow-inner
            animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <CurrentTab setForm={setScoutingForm} />
          </div>
        </div>
      </div>
    </div>
  );
};
