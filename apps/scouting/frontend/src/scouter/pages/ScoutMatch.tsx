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
import {
  defaultScoutForm,
  type Alliance,
  type ScoutingForm,
} from "@repo/scouting_types";
import { ShiftTab } from "./tabs/ShiftTab";
import { useLocalStorage } from "@repo/local_storage_hook";
import { PostMatchTab } from "./tabs/PostMatchTab";
import { useNavigate } from "react-router-dom";
import { ClimbTab } from "./tabs/ClimbTab";
import { PreMatchTab } from "./tabs/PreMatchTab";
import { useMatchTimer } from "../hooks/useMatchTimer";
import StartMatchLocallyButton from "../components/StartMatchLocallyButton";
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

const ITERATION_PERIOD_MS = 10;

const TABS: Tab[] = [
  {
    name: "Pre",
    Component: PreMatchTab,
  },
  {
    name: "Start Match",
    Component: () => <StartMatchLocallyButton disabled={false} />,
  },
  {
    name: "Auto",
    Component: (props) => <ShiftTab shiftType="auto" tabIndex={0} {...props} />,
  },
  {
    name: "Climb",
    Component: (props) => <ClimbTab isAuto={true} {...props} />,
  },
  {
    name: "Transition",
    Component: (props) => (
      <ShiftTab shiftType={"transition"} tabIndex={0} {...props} />
    ),
  },
  {
    name: "Shift1",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={0} {...props} />
    ),
  },
  {
    name: "Shift2",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={1} {...props} />
    ),
  },
  {
    name: "Shift3",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={2} {...props} />
    ),
  },
  {
    name: "Shift4",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={3} {...props} />
    ),
  },
  {
    name: "Endgame",
    Component: (props) => (
      <ShiftTab shiftType={"endgame"} tabIndex={0} {...props} />
    ),
  },
  {
    name: "Climb",
    Component: (props) => <ClimbTab isAuto={false} {...props} />,
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
  const navigate = useNavigate();
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
      <div className="w-full">
        <button
          className="my-auto w-full bg-[#e83e2e] h-8"
          onClick={() => {
            void navigate("/");
          }}
        >
          Back
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

export type ShiftNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const AUTO_END = 20000;
const TRANSITION_END = 30000;
const MATCH_END = 160000;

const TELEOP_DURATION = MATCH_END - TRANSITION_END;
const TELEOP_SHIFT_COUNT = 4;
const TELEOP_SHIFT_LENGTH = TELEOP_DURATION / TELEOP_SHIFT_COUNT;
export const createNewScoutingForm = (
  savedInfo?: Partial<ScoutingForm>,
): ScoutingForm => structuredClone({ ...defaultScoutForm, ...savedInfo });
export const ScoutMatch: FC = () => {
  const [scoutingForm, setScoutingForm] = useLocalStorage(
    "form",
    createNewScoutingForm(),
  );
  const [activeTabIndex, setActiveTab] = useState(STARTING_TAB_INDEX);
  const [alliance, _setAlliance] = useState<Alliance>("blue");
  const originTime = useMemo(() => Date.now(), []);
  const CurrentTab = useMemo(
    () => TABS[activeTabIndex].Component,
    [activeTabIndex],
  );
  const SHIFT_END_TIME_MS: Record<ShiftNumber, number> = {
    1: AUTO_END,
    2: TRANSITION_END,
    3: TRANSITION_END + TELEOP_SHIFT_LENGTH * 1,
    4: TRANSITION_END + TELEOP_SHIFT_LENGTH * 2,
    5: TRANSITION_END + TELEOP_SHIFT_LENGTH * 3,
    6: TRANSITION_END + TELEOP_DURATION,
    7: MATCH_END,
  };
  const { elapsedMs } = useMatchTimer(ITERATION_PERIOD_MS);
  useEffect(() => {
    if (activeTabIndex !== 1) {
      if (elapsedMs > 0) {
        setActiveTab(2);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[1]) {
        setActiveTab(4);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[2]) {
        setActiveTab(5);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[3]) {
        setActiveTab(6);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[4]) {
        setActiveTab(7);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[5]) {
        setActiveTab(8);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[6]) {
        setActiveTab(9);
      }
      if (elapsedMs > SHIFT_END_TIME_MS[7]) {
        setActiveTab(10);
      }
    }
  }, [elapsedMs]);
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
        {alliance === "blue" && (
          <SideBar
            setActiveTab={setActiveTab}
            activeTabIndex={activeTabIndex}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden p-2 relative z-10">
          <div
            className="flex-1 min-h-0 text-green-100 overflow-hidden pr-2
           bg-black/40 rounded-xl p-3 sm:p-4 lg:p-6 border border-green-500/20 shadow-inner
            animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <CurrentTab
              setForm={setScoutingForm}
              currentForm={scoutingForm}
              alliance={alliance}
              originTime={originTime}
            />
          </div>
        </div>
        {alliance === "red" && (
          <SideBar
            setActiveTab={setActiveTab}
            activeTabIndex={activeTabIndex}
          />
        )}
      </div>
    </div>
  );
};
