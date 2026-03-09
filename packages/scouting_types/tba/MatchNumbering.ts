// בס"ד
import { Match } from "../rebuilt";
import { TBAMatch } from "./TBAMatch";

const PLAYOFF_MATCHES_UNTIL_FINALS = 13;

export const tbaMatchToRegularMatch = (tbaMatch: TBAMatch): Match => {
  const matchNumber = tbaMatch.match_number;
  const setNumber = tbaMatch.set_number;
  const matchLevel = tbaMatch.comp_level;

  if (matchLevel === "pc") {
    return { number: matchNumber, type: "practice" };
  }
  if (matchLevel === "qm") {
    return { number: matchNumber, type: "qualification" };
  }

  if (matchLevel === "sf") {
    return { number: setNumber, type: "playoff" };
  }
  return { number: setNumber + PLAYOFF_MATCHES_UNTIL_FINALS, type: "playoff" };
};
