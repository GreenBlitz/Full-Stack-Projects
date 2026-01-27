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
import { defaultScoutForm, type Alliance, type ScoutingForm } from "@repo/scouting_types";
import { ShiftTab } from "./tabs/ShiftTab";
import { useLocalStorage } from "@repo/local_storage_hook";
import { PostMatchTab } from "./tabs/PostMatchTab";
export interface TabProps {
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
  currentForm: ScoutingForm;
  alliance: Alliance;
  originTime: number;
}

interface Tab {
  name: string;
  Component: FC<TabProps>;
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
    name: "Shift1",
    Component: (props) => <ShiftTab tabIndex={0} {...props} />,
  },
  {
    name: "Shift2",
    Component: (props) => <ShiftTab tabIndex={1} {...props} />,
  },
  {
    name: "Shift3",
    Component: (props) => <ShiftTab tabIndex={2} {...props} />,
  },
  {
    name: "Shift4",
    Component: (props) => <ShiftTab tabIndex={3} {...props} />,
  },
  {
    name: "Endgame",
    Component: () => <div className="p-4">Endgame Content</div>,
  },
  {
    name: "Post",
    Component: PostMatchTab,
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
      <button
        onClick={goToPrev}
        disabled={activeTabIndex === STARTING_TAB_INDEX}
        className="scouter-navigation-button"
      >
        ⬆<br /> Prev
      </button>
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
                shrink-0 flex w-full py-3 text-sm font-bold rounded-xl 
                transition-all duration-300 text-left relative overflow-hidden group
                px-2
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

export type ColorOfScoutingForm = "from-red-950 via-red-900 to-black border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)]" |
"from-black via-gray-900 to-black border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"

export type Shift = "Autonomous" | "Transition" | "Shift1" | "Shift2" | "Shift3" | "Shift4" | "Endgame"

const MILLISECONDS_IN_A_SECOND = 1000
const END_OF_AUTO_TIMESTEMP_IN_SECONDS = 20
const END_OF_TRANSITION_TIMESTEMP_IN_SECONDS = 30
const END_OF_FIRST_SHIFT_TIMESTEMP_IN_SECONDS = 55
const END_OF_SECOND_SHIFT_TIMESTEMP_IN_SECONDS = 80
const END_OF_THIRD_SHIFT_TIMESTEMP_IN_SECONDS = 105
const END_OF_FOURTH_SHIFT_TIMESTEMP_IN_SECONDS = 130
const END_OF_GAME_IN_SECONDS = 160

const END_OF_SHIFT_TIMESTEMPS_SECONDS = [END_OF_AUTO_TIMESTEMP_IN_SECONDS,
  END_OF_TRANSITION_TIMESTEMP_IN_SECONDS,
  END_OF_FIRST_SHIFT_TIMESTEMP_IN_SECONDS,
  END_OF_SECOND_SHIFT_TIMESTEMP_IN_SECONDS,
  END_OF_THIRD_SHIFT_TIMESTEMP_IN_SECONDS,
  END_OF_FOURTH_SHIFT_TIMESTEMP_IN_SECONDS,
  END_OF_GAME_IN_SECONDS].map(timeStemp=>timeStemp*MILLISECONDS_IN_A_SECOND)

export const createNewScoutingForm = (): ScoutingForm =>
  JSON.parse(JSON.stringify(defaultScoutForm));

export const ScoutMatch: FC = () => {
  const [scoutingForm, setScoutingForm] = useLocalStorage(
    "form",
    createNewScoutingForm(),
  );
  const [activeTabIndex, setActiveTab] = useState(STARTING_TAB_INDEX);

  const originTime = useMemo(() => Date.now(), []);
console.log(scoutingForm);//remove this its for build
  const CurrentTab = useMemo(
    () => TABS[activeTabIndex].Component,
    [activeTabIndex],
  );

  const [scoutingFormColor, setScoutingFormColor] = useState<ColorOfScoutingForm>(
    "from-black via-gray-900 to-black border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
  )

  const getCurrentRelativeTime = () => {
    return Date.now() - originTime;
  };

  const hasPassedShiftTime = (tabIndex: number, currentShift: Shift )=>{
    return 0;
  }

  useEffect(() => {
  const id = window.setInterval(() => {
    if (getCurrentRelativeTime() >= MILLISECONDS_IN_A_SECOND && activeTabIndex==STARTING_TAB_INDEX){
      setScoutingFormColor("from-red-950 via-red-900 to-black border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)]")
    }
  }, MILLISECONDS_IN_A_SECOND);

  return () => window.clearInterval(id);
}, [originTime]);


  return (
    <div
      className={`flex flex-row max-w-5xl w-full mx-auto bg-linear-to-br
      ${scoutingFormColor}
      overflow-hidden h-[90vh] relative`}
    >
      <div
        className="flex flex-row max-w-5xl w-full mx-auto bg-linear-to-br
        ${scoutingFormColor}
        overflow-hidden h-[90vh] relative"
      >
        <SideBar setActiveTab={setActiveTab} activeTabIndex={activeTabIndex} />

        <div className="flex-1 flex flex-col overflow-hidden p-2 relative z-10">
          <div
            className="flex-1 text-green-100 overflow-y-auto pr-2
           bg-black/40 rounded-xl p-6 border border-green-500/20 shadow-inner
            animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <CurrentTab
              setForm={setScoutingForm}
              alliance="red"
              originTime={originTime}
              currentForm={scoutingForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
