// בס"ד
import { type BitArray, rangeArr } from "../BitArray";
import type { Serde } from "../types";
import { serdeUnsignedInt } from "./serde-number";

const arrayLengthDefaultBitCount = 12;
export const serdeArray = <T>(
  itemSerde: Serde<T>,
  bitCount = arrayLengthDefaultBitCount,
): Serde<T[]> => {
  const arrayLengthSerde = serdeUnsignedInt(bitCount);
  return {
    serializer(serializedData: BitArray, array: T[]) {
      const itemSerializer = itemSerde.serializer;
      arrayLengthSerde.serializer(serializedData, array.length);
      array.forEach((value) => {
        itemSerializer(serializedData, value);
      });
    },
    deserializer(serializedData: BitArray): T[] {
      const itemDeserializer = itemSerde.deserializer;
      const arrayLength = arrayLengthSerde.deserializer(serializedData);

      return rangeArr(arrayLength).map(() => itemDeserializer(serializedData));
    },
  };
};

export const serdeStringifiedArray = <T>(
  itemSerde: Serde<T>,
): Serde<string> => ({
  serializer(serializedData: BitArray, arr: string) {
    serdeArray(itemSerde).serializer(serializedData, JSON.parse(arr));
  },
  deserializer: (serializedData: BitArray) =>
    JSON.stringify(serdeArray(itemSerde).deserializer(serializedData)),
});
