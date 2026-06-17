// בס"ד

import { useState, type FC } from "react";
import { type Alliance, type MatchType } from "@repo/scouting_types";
import { TeamCard } from "./TeamCard";
import { MatchInfoCard } from "./MatchInfoCard";

type TeamIndex = 0 | 1 | 2;

const createEmptyAllianceTeam = () => ({
  active: "",
  inactive: "",
  driving: {
    comments: "",
    rating: null,
  },
  faults: "",
  teamNumber: 0,
});

const ALLIANCE_SIZE = 3;
const createEmptyAllianceTeams = () => [
  createEmptyAllianceTeam(),
  createEmptyAllianceTeam(),
  createEmptyAllianceTeam(),
];

export const SuperScoutTab: FC = () => {
  return <></>;
};
