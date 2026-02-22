// בס"ד
import * as t from "io-ts";
import type { GeneralFuelData } from "../rebuilt";

export const forecastProps = t.type({
  redAlliance: t.tuple([t.number, t.number, t.number]),
  blueAlliance: t.tuple([t.number, t.number, t.number]),
});

export interface ClimbAllianceData {
  auto: number;
  tele: number;
}
interface FuelAllianceData {
  auto: number;
  tele: number;
  fullGame: number;
}

export interface AllianceData {
  climb: ClimbAllianceData;
  fuel: FuelAllianceData;
}
export const defaultAllianceData: AllianceData = {
  climb: { auto: 0, tele: 0 },
  fuel: { auto: 0, tele: 0, fullGame: 0 },
};

export interface Forecast {
  allianceData: { redAlliance: AllianceData; blueAlliance: AllianceData };
}

const PASS_POINT_VALUE = 0.6;

export const convertGeneralToAllianceData = ({
  climb,
  fuel,
}: {
  climb: ClimbAllianceData;
  fuel: GeneralFuelData;
}): AllianceData => ({
  climb,
  fuel: {
    auto: fuel.auto.scored + fuel.auto.passed * PASS_POINT_VALUE,
    tele: fuel.tele.scored + fuel.tele.passed * PASS_POINT_VALUE,
    fullGame: fuel.fullGame.scored + fuel.fullGame.passed * PASS_POINT_VALUE,
  },
});
