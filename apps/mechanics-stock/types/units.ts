// בס"ד
export interface UnitBase<T extends string, K> {
  class: T;
  type: K;
  amount: number;
}
type LengthUnit = UnitBase<
  "length",
  "milimeter" | "centimeter" | "meter" | "inch" | "foot"
>;

export type AreaUnit = UnitBase<
  "area",
  { length: LengthUnit; width: LengthUnit } | "centimeter" | "meter"
>;
export type VolumeUnit = UnitBase<
  "volume",
  | { length: LengthUnit; width: LengthUnit; height: LengthUnit }
  | { area: AreaUnit; height: LengthUnit }
  | "centimeter"
  | "meter"
>;
export type Unit =
  | LengthUnit
  | AreaUnit
  | VolumeUnit
  | UnitBase<"weight", "gram" | "kilogram" | "pound">
  | UnitBase<"none", "amount">;

export type UnitClass = Unit["class"];
export type UnitType = Unit["type"];
