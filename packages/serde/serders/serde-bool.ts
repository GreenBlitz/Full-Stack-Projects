// בס"ד
import type { BitArray } from "../BitArray";
import type { Serde } from "../types";

export const serdeBool = (): Serde<boolean> => ({
  serializer(serializedData: BitArray, bool: boolean) {
    serializedData.insertBool(bool);
  },
  deserializer: (serializedData: BitArray) => serializedData.consumeBool(),
});
