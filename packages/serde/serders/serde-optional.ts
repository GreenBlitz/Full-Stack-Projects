// בס"ד
import type { BitArray } from "../BitArray";
import type { Serde } from "../types";
import { serdeBool } from "./serde-bool";

export const serdeOptional = <T>(tSerde: Serde<T>): Serde<T | undefined> => ({
  serializer(serializedData: BitArray, value?: T) {
    serdeBool().serializer(serializedData, value != undefined);
    if (value) {
      tSerde.serializer(serializedData, value);
    }
  },
  deserializer: (serializedData: BitArray): T | undefined =>
    serdeBool().deserializer(serializedData)
      ? tSerde.deserializer(serializedData)
      : undefined,
});
