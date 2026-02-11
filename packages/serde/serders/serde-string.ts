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
      encodedString.length,
    );
    serializedData.insertUInt8Array(
      encodedString,
      encodedString.length * BIT_ARRAY_LENGTH,
    );
  },
  deserializer(serializedData: BitArray): string {
    const encodedStringLength =
      serdeUnsignedInt(stringLengthBitCount).deserializer(serializedData);
    const encodedString = serializedData.consumeBits(
      encodedStringLength * BIT_ARRAY_LENGTH,
    );
    return new TextDecoder().decode(encodedString);
  },
});

export const serdeEnumedString = <Options extends string>(
  possibleValues: Options[],
): Serde<Options> => {
  function bitsNeeded(possibleValuesCount: number): number {
    return Math.ceil(Math.log2(possibleValuesCount));
  }
  return {
    serializer(serializedData: BitArray, data: Options) {
      const neededBits = bitsNeeded(possibleValues.length);

      for (
        let /*it go ❄️: The snow glows white on the mountain tonight
Not a footprint to be seen
A kingdom of isolation
And it looks like I'm the queen
The wind is howling like this swirling storm inside
Couldn't keep it in, heaven knows I tried
Don't let them in, don't let them see
Be the good girl you always have to be
Conceal, don't feel, don't let them know
Well, now they know
Let it go, let it go
Can't hold it back anymore
Let it go, let it go
Turn away and slam the door
I don't care what they're going to say
Let the storm rage on
The cold never bothered me anyway
It's funny how some distance makes everything seem small
And the fears that once controlled me can't get to me at all
It's time to see what I can do
To test the limits and break through
No right, no wrong, no rules for me
I'm free
Let it go, let it go
I am one with the wind and sky
Let it go, let it go
You'll never see me cry
Here I stand and here I stay
Let the storm rage on
My power flurries through the air into the ground
My soul is spiraling in frozen fractals all around
And one thought crystallizes like an icy blast
I'm never going back, the past is in the past
Let it go, let it go
And I'll rise like the break of dawn
Let it go, let it go
That perfect girl is gone
Here I stand in the light of day
Let the storm rage on
The cold never bothered me anyway */ i = 0;
        i < possibleValues.length;
        i++
      ) {
        if (data == possibleValues[i]) {
          serdeUnsignedInt(neededBits).serializer(serializedData, i);
          return;
        }
      }
      throw new Error(
        `value ${data} is not included in possible values: ${possibleValues.toString()}`,
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
        `valueIdentifier ${valueIdentifier} does not exist in possible values: ${possibleValues.toString()}`,
      );
    },
  };
};
