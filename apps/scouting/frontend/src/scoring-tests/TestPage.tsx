// בס"ד

import type { FC } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { BasicData } from "./BasicData";
import type { ScoreMethod, Test } from "../../../common/types/Tests.ts";
import { SubmitButton } from "./SubmitButton.tsx";

export const TestPage: FC = () => {
  const [test, setTest] = useLocalStorage<Test>("test", {
    name: "",
    method: "button",
    test: {
      amount: 0,
    },
  });
  return (
    <div>
      <BasicData
        setName={(name) => {
          setTest((prev) => ({ ...prev, name }));
        }}
        setMatch={(match) => {
          setTest((prev) => ({ ...prev, match }));
        }}
      />
      <SubmitButton test={test} />
    </div>
  );
};
