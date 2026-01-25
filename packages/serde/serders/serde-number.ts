// בס"ד
import { BitArray, rangeArr } from "../BitArray";
import type { Serde } from "../types";
import isOdd from "is-odd";

export const serdeUnsignedInt = (bitCount: number): Serde<number> => ({
  serializer(serialiedData: BitArray, unsignedInt: number) {
    const array = new BitArray();

    rangeArr(bitCount).forEach((i) => {
      array.insertBool(isOdd(unsignedInt >> i));
    });
    serialiedData.insertBitArray(array);
  },
  deserializer(serializedData: BitArray): number {
    const sumStartingValue = 0;

    const sum = rangeArr(bitCount).reduce(
      (acc, i) => acc + (Number(serializedData.consumeBool()) << i),
      sumStartingValue
    );
    return sum;
  },
});

const signDifferentatior = 0;
const isNegative = (signedInteger: number) =>
  signedInteger < signDifferentatior;

export const serdeSignedInt = (bitCount: number): Serde<number> => {
  const signBits = 1;
  const unsignedBitCount = bitCount - signBits;
  const serdeUnsigned = serdeUnsignedInt(unsignedBitCount);
  return {
    serializer(serialiedData: BitArray, signedInt: number) {
      const unsignedInt = Math.abs(signedInt);

      serialiedData.insertBool(isNegative(signedInt));
      serdeUnsigned.serializer(serialiedData, unsignedInt);
    },
    deserializer(serializedData: BitArray): number {
      const isSignNegative = serializedData.consumeBool();
      const unsignedInt = serdeUnsigned.deserializer(serializedData);

      return isSignNegative ? -unsignedInt : unsignedInt;
    },
  };
};

export const serdeStringifiedNum = (bitCount: number): Serde<string> => ({
  serializer: (seriailzedData: BitArray, num: string) => {
    serdeUnsignedInt(bitCount).serializer(seriailzedData, Number(num));
  },
  deserializer: (seriailzedData: BitArray): string => {
    return serdeUnsignedInt(bitCount).deserializer(seriailzedData).toString();
  },
});
