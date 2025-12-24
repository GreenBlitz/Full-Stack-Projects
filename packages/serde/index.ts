// בס"ד
import { BitArray } from "./BitArray";
import type { Deserializer, Serializer } from "./types";

export const serialize = <T>(
  serializer: Serializer<T>,
  data: T
): Uint8Array => {
  const serializedData = new BitArray();
  serializer(serializedData, data);
  return serializedData.consume();
};

export const deserialize = <T>(
  deserializer: Deserializer<T>,
  serializedDataUint8: Uint8Array
): T => {
  const serializedData = new BitArray(serializedDataUint8);
  return deserializer(serializedData);
};
