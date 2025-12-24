// בס"ד
import { BitArray, rangeArr } from "../BitArray";
import type { Serde } from "../types";

const binaryTrueValue = 1;
const binaryModulus = 2;
// TODO add signed support!
export const serdeUnsignedInt = (bitCount: number): Serde<number> => ({
  serializer(serialiedData: BitArray, num: number) {
    const arr = new BitArray();

    rangeArr(bitCount).forEach(() => {
      arr.insertBool(num % binaryModulus === binaryTrueValue);
      num = Math.floor(num / binaryModulus);
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