// בס"ד
import { BIT_ARRAY_LENGTH, type BitArray } from "../BitArray";
import type { Serde } from "../types";
import { serdeUnsignedInt } from "./serde-number";

const stringLengthBitCount = 12;
export const serdeString = (): Serde<string> => ({
  serializer(serializedData: BitArray, string: string) {
    const encodedString: Uint8Array = new TextEncoder().encode(string);

    serdeUnsignedInt(stringLengthBitCount).serializer(
      serializedData,
      encodedString.length
    );
    serializedData.insertUInt8Array(
      encodedString,
      encodedString.length * BIT_ARRAY_LENGTH
    );
  },
  deserializer(serializedData: BitArray): string {
    const encodedStringLength =
      serdeUnsignedInt(stringLengthBitCount).deserializer(serializedData);
    const encodedString = serializedData.consumeBits(
      encodedStringLength * BIT_ARRAY_LENGTH
    );
    return new TextDecoder().decode(encodedString);
  },
});

export const serdeEnumedString = <Options extends string>(
  possibleValues: Options[]
): Serde<Options> => {
  function bitsNeeded(possibleValuesCount: number): number {
    return Math.ceil(Math.log2(possibleValuesCount));
  }
  return {
    serializer(serializedData: BitArray, data: Options) {
      const neededBits = bitsNeeded(possibleValues.length);

      const hasMatch = possibleValues.some((value, index) => {
        if (data !== value) {
          return false;
        }
        serdeUnsignedInt(neededBits).serializer(serializedData, index);
        return true;
      });
      if (hasMatch) {
        return;
      }
      throw new Error(
        `value ${data} is not included in possible values: ${possibleValues.toString()}`
      );
    },
    deserializer(serializedData: BitArray): Options {
      const neededBits = bitsNeeded(possibleValues.length);
      const valueIdentifier =
        serdeUnsignedInt(neededBits).deserializer(serializedData);
      if (valueIdentifier < possibleValues.length) {
        return possibleValues[valueIdentifier];
      }
      throw new Error(
        `valueIdentifier ${valueIdentifier} does not exist in possible values: ${possibleValues.toString()}`
      );
    },
  };
};
