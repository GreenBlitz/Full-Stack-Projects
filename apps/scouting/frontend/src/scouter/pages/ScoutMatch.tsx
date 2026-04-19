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
import { PreMatchTab } from "./tabs/PreMatchTab";
import { useMatchTimer } from "../hooks/useMatchTimer";
import StartMatchLocallyButton, {
  type TimerData,
} from "../components/StartMatchLocallyButton";
import { boolean } from "io-ts";
import { AutoTab } from "./tabs/AutoTab";
export interface TabProps {
  setForm: Dispatch<SetStateAction<ScoutingForm>>;
  currentForm: ScoutingForm;
  alliance: Alliance;
  originTime: number;
  timerData: TimerData;
  setAlliance: Dispatch<SetStateAction<Alliance>>;
}
interface Tab {
  name: string;
  Component: FC<TabProps>;
  ShiftEndTimeMs: number;
  ShiftExtraEndTimeMs: number;
}

const ITERATION_PERIOD_MS = 10;

const AUTO_END = 20_000;
const TRANSITION_END = 30_000;

const SHIFT_1_END = 55_000;
const SHIFT_2_END = 80_000;
const SHIFT_3_END = 105_000;
const SHIFT_4_END = 130_000;
const MATCH_END = 160_000;

const MILLISECONDS_IN_FIVE_SECONDS = 5000;

const TABS: Tab[] = [
  {
    name: "Pre",
    Component: PreMatchTab,
    ShiftEndTimeMs: 0,
    ShiftExtraEndTimeMs: 0,
  },
  {
    name: "Start",
    Component: (props) => (
      <StartMatchLocallyButton timerData={props.timerData} disabled={false} />
    ),
    ShiftEndTimeMs: 0,
    ShiftExtraEndTimeMs: 0,
  },
  {
    name: "Auto",
    Component: (props) => <AutoTab {...props} />,
    ShiftEndTimeMs: AUTO_END,
    ShiftExtraEndTimeMs: AUTO_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Transition",
    Component: (props) => (
      <ShiftTab shiftType={"transition"} tabIndex={0} {...props} />
    ),
    ShiftEndTimeMs: TRANSITION_END,
    ShiftExtraEndTimeMs: TRANSITION_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Shift1",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={0} {...props} />
    ),
    ShiftEndTimeMs: SHIFT_1_END,
    ShiftExtraEndTimeMs: SHIFT_1_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Shift2",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={1} {...props} />
    ),
    ShiftEndTimeMs: SHIFT_2_END,
    ShiftExtraEndTimeMs: SHIFT_2_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Shift3",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={2} {...props} />
    ),
    ShiftEndTimeMs: SHIFT_3_END,
    ShiftExtraEndTimeMs: SHIFT_3_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Shift4",
    Component: (props) => (
      <ShiftTab shiftType={"teleop"} tabIndex={3} {...props} />
    ),
    ShiftEndTimeMs: SHIFT_4_END,
    ShiftExtraEndTimeMs: SHIFT_4_END - MILLISECONDS_IN_FIVE_SECONDS,
  },
  {
    name: "Endgame",
    Component: (props) => (
      <ShiftTab shiftType={"endgame"} tabIndex={0} {...props} />
    ),
    ShiftEndTimeMs: MATCH_END,
    ShiftExtraEndTimeMs: MATCH_END,
  },
  {
    name: "Post",
    Component: PostMatchTab,
    ShiftEndTimeMs: 0,
    ShiftExtraEndTimeMs: 0,
  },
];

type TabName = (typeof TABS)[number]["name"];

const TAB_NAME_TO_INDEX: Record<TabName, number> = Object.fromEntries(
  TABS.map((tab, index) => [tab.name, index]),
);

interface SideBarProps {
  setActiveTab: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
  teamNumber: number;
}
const ONE_ARRAY_ELEMENT = 1;
const MOVEMENT_AMOUNT = 1;
const STARTING_TAB_INDEX = 0;
const SideBar: FC<SideBarProps> = ({
  teamNumber,
  setActiveTab,
  activeTabIndex,
}) => {
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
      <div className="my-auto w-full bg-[#e8d52e] h-8 text-black rounded-md text-center font-bold tracking-wider flex items-center justify-center shadow-[0_0_15px_rgba(232,213,46,0.8)]">
        <span className="drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)]">
          {teamNumber}
        </span>
      </div>
    </div>
  );
};

export const createNewScoutingForm = (
  savedInfo?: Partial<ScoutingForm>,
): ScoutingForm => structuredClone({ ...defaultScoutForm, ...savedInfo });
export const ScoutMatch: FC = () => {
  const [scoutingForm, setScoutingForm] = useLocalStorage(
    "form",
    createNewScoutingForm(),
  );
  const [backgroundColor, setBackgroundColor] = useState("bg-black/40");
  const [activeTabIndex, setActiveTab] = useState(STARTING_TAB_INDEX);
  const [alliance, setAlliance] = useState<Alliance>("red");
  const originTime = useMemo(() => Date.now(), []);
  const CurrentTab = useMemo(() => {
    return TABS[activeTabIndex]?.Component ?? PostMatchTab;
  }, [activeTabIndex]);

  const hasShiftJustEnded = (elapsedMs: number): boolean =>
    elapsedMs > 0 &&
    TABS.some(
      (tab) =>
        tab.ShiftEndTimeMs >= elapsedMs && elapsedMs >= tab.ShiftExtraEndTimeMs,
    );

  const timerData = useMatchTimer(ITERATION_PERIOD_MS);

  const previousIsRunningRef = useRef(timerData.isRunning);

  const getTabIndexFromElapsedMs = (elapsedMs: number): number =>
    TABS.findIndex((tab) => elapsedMs <= tab.ShiftEndTimeMs);

  useEffect(() => {
    setBackgroundColor(
      hasShiftJustEnded(timerData.elapsedMs)
        ? "bg-amber-400/40"
        : "bg-black/40",
    );

    const hasJustStartedOrResumed =
      !previousIsRunningRef.current && timerData.isRunning;

    const nextTab = getTabIndexFromElapsedMs(timerData.elapsedMs);

    const startMatchTab = TABS.findIndex((tab) => tab.name === "Start Match");

    const shouldSyncFromStartMatchTab =
      activeTabIndex === startMatchTab && hasJustStartedOrResumed;

    const ONE_SECOND = 1000;

    const shouldSyncNormally =
      activeTabIndex !== startMatchTab &&
      timerData.elapsedMs > 0 &&
      timerData.elapsedMs <= MATCH_END + ONE_SECOND;

    if (
      (shouldSyncFromStartMatchTab || shouldSyncNormally) &&
      activeTabIndex !== nextTab
    ) {
      setActiveTab(nextTab);
    }

    previousIsRunningRef.current = timerData.isRunning;
  }, [
    timerData,
    timerData.isRunning,
    timerData.elapsedMs,
    activeTabIndex,
    setActiveTab,
  ]);
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
            teamNumber={scoutingForm.teamNumber}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden p-2 relative z-10">
          <div
            className={`flex-1 min-h-0 text-green-100 overflow-hidden pr-2
            ${backgroundColor} rounded-xl p-3 sm:p-4 lg:p-6 border border-green-500/20 shadow-inner
            animate-in fade-in slide-in-from-right-4 duration-300`}
          >
            <CurrentTab
              setForm={setScoutingForm}
              currentForm={scoutingForm}
              alliance={alliance}
              originTime={originTime}
              timerData={timerData}
              setAlliance={setAlliance}
            />
          </div>
        </div>
        {alliance === "red" && (
          <SideBar
            setActiveTab={setActiveTab}
            activeTabIndex={activeTabIndex}
            teamNumber={scoutingForm.teamNumber}
          />
        )}
      </div>
    </div>
  );
};
