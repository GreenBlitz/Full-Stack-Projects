// בס"ד

import type { FC } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { BasicData } from "./BasicData";
import type { ScoreMethod, Test } from "../../../common/types/Tests.ts";
import { SubmitButton } from "./SubmitButton.tsx";
import { ButtonTest } from "./ButtonTest.tsx";
import { DragTest } from "./DragTest.tsx";

export interface TestProps {
  setTest: (test: Test["test"]) => void;
}

export const TestPage: FC = () => {
  const [test, setTest] = useLocalStorage<Test>("test", {
    name: "",
    method: "button",
    test: {
      amount: 0,
    },
  });

  const setTestedData = (newTest: Test["test"]) => {
    setTest((prev) => ({ ...prev, test: newTest as any }));
  };
  return (
    <div>
      <BasicData
        setName={(name) => {
          setTest((prev) => ({ ...prev, name }));
        }}
        setMatch={(match) => {
          setTest((prev) => ({ ...prev, match }));
        }}
        setMethod={(method) => {
          setTest((prev) => ({ ...prev, test: {} as any, method }));
        }}
      />
      {test.method === "button" && <ButtonTest setTest={setTestedData} />}
      {test.method === "drag" && <DragTest setTest={setTestedData} />}
      <SubmitButton test={test} />
    </div>
  );
};
