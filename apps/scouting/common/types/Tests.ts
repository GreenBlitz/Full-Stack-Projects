// בס"ד

export type ScoreMethod = "bpm" | "drag" | "button" | "time";

interface TestBase<Method extends ScoreMethod, TestBody extends {}> {
  name: string;
  method: Method;
  test: TestBody;
}

type CountTest = TestBase<"button" | "drag", { amount: number }>;

interface TimeInterval {
  start: number;
  end: number;
}
type TimeTest = TestBase<"time", { intervals: TimeInterval[] }>;

interface BPMInterval {
  time: number;
  scores: number[];
}
type BPMTest = TestBase<"bpm", { intervals: BPMInterval[] }>;

export type Test = CountTest | TimeTest | BPMTest;
