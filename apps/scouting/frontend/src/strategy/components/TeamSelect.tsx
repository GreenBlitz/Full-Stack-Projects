// בס"ד

import { firstElement } from "@repo/array-functions";
import { FRC_TEAMS } from "@repo/frc";
import type { FC } from "react";

export const TeamSelect: FC<{ setTeamNumber: (team: number) => void }> = ({
  setTeamNumber,
}) => (
  <>
    <input
      onChange={(event) => {
        setTeamNumber(Number(event.currentTarget.value));
      }}
      type="number"
      className="bg-white"
    />
    <select
      className="bg-slate-400"
      onChange={(event) => {
        setTeamNumber(
          Number(firstElement(event.currentTarget.value.split(":"))),
        );
      }}
    >
      {FRC_TEAMS.map((team) => (
        <option
          key={team.teamNumber}
        >{`${team.teamNumber}:${team.nickname}`}</option>
      ))}
    </select>
  </>
);
