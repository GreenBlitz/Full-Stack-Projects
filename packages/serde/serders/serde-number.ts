// בס"ד
import { BitArray, rangeArr } from "../BitArray";
import type { Serde } from "../types";
import isOdd from "is-odd";

export const serdeUnsignedInt = (bitCount: number): Serde<number> => ({
  serializer(serialiedData: BitArray, unsignedInt: number) {
    const arr = new BitArray();

    rangeArr(bitCount).forEach((i) => {
      arr.insertBool(isOdd(unsignedInt >> i));
    });
    serialiedData.insertBitArray(arr);
  },
  deserializer(serializedData: BitArray): number {
    const sumStartingValue = 0;

    const sum = rangeArr(bitCount).reduce(
      (acc) => acc + Number(serializedData.consumeBool()),
      sumStartingValue
    );
    return sum;
  },
});

export const serdeStringifiedNum = (bitCount: number): Serde<string> => ({
  serializer: (seriailzedData: BitArray, num: string) => {
    serdeUnsignedInt(bitCount).serializer(seriailzedData, Number(num));
  },
  deserializer: (seriailzedData: BitArray): string => {
    return serdeUnsignedInt(bitCount).deserializer(seriailzedData).toString();
  },
});
