// בס"ד
/* eslint-disable @typescript-eslint/unbound-method */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { type CalledWithMock, mock } from "vitest-mock-extended";
import { BitArray } from "../BitArray";
import {
  serdeUnsignedInt,
  serdeSignedInt,
  serdeStringifiedNum,
} from "./serde-number";

describe("serde-number", () => {
  const mockParentBitArray = mock<BitArray>();
  const mockInternalBitArray = mock<BitArray>();

  beforeEach(() => {
    vi.clearAllMocks();
    // When 'new BitArray()' is called, return our controlled mock
    vi.mocked(BitArray).mockImplementation(() => mockInternalBitArray);
  });

  describe("serdeUnsignedInt", () => {
    const testedNumber = 5;
    const expectedOutcomes: Record<number, boolean> = {
      1: true,
      2: false,
      3: true,
    };

    it("should serialize 5 as 101 in binary (3 bits)", () => {
      const bitCount = 3;
      const { serializer } = serdeUnsignedInt(bitCount);

      serializer(mockParentBitArray, testedNumber); // 5 is 101 binary

      // Verify the internal bit array received the correct bits
      // 5 >> 0 = 5 (odd: true), 5 >> 1 = 2 (even: false), 5 >> 2 = 1 (odd: true)

      Object.entries(expectedOutcomes).forEach(([key, value]) => {
        expect(mockInternalBitArray.insertBool).toHaveBeenNthCalledWith(
          parseInt(key),
          value
        );
      });

      // Verify the internal array was inserted into the main data
      expect(mockParentBitArray.insertBitArray).toHaveBeenCalledWith(
        mockInternalBitArray
      );
    });

    it("should deserialize 101 binary back to 5", () => {
      const bitCount = 3;
      const { deserializer } = serdeUnsignedInt(bitCount);

      // Mock return values for consumeBool: 1, 0, 1
      Object.values(expectedOutcomes).reduce<CalledWithMock<boolean, []>>(
        (acc, value) => acc.mockResolvedValue(value),
        vi.mocked(mockParentBitArray.consumeBool)
      );

      const result = deserializer(mockParentBitArray);
      expect(result).toBe(testedNumber);
    });
  });

  describe("serdeSignedInt", () => {
    const testedNumber = -5;

    it("should serialize -5 correctly", () => {
      const bitCount = 4; // 1 sign bit + 3 value bits
      const { serializer } = serdeSignedInt(bitCount);

      serializer(mockParentBitArray, testedNumber);

      // Should insert 'true' for negative sign
      expect(mockParentBitArray.insertBool).toHaveBeenCalledWith(true);
      // Should then serialize the absolute value (5)
      expect(mockParentBitArray.insertBitArray).toHaveBeenCalled();
    });

    it("should deserialize negative sign and value correctly", () => {
      const bitCount = 4;
      const { deserializer } = serdeSignedInt(bitCount);

      // Sign bit = true (negative), Value bits = 1, 0, 1 (5)
      vi.mocked(mockParentBitArray.consumeBool)
        .mockReturnValueOnce(true) // Negative
        .mockReturnValueOnce(true) // 1
        .mockReturnValueOnce(false) // 0
        .mockReturnValueOnce(true); // 1

      const result = deserializer(mockParentBitArray);
      expect(result).toBe(testedNumber);
    });
  });

  describe("serdeStringifiedNum", () => {
    const testedNumber = 4;
    it("should convert string input to number during serialization", () => {
      const { serializer } = serdeStringifiedNum(testedNumber);
      serializer(mockParentBitArray, "10");

      // Verify it treated "10" as a number (checked via internal bit insertion)
      expect(mockParentBitArray.insertBitArray).toHaveBeenCalled();
    });

    it("should return a string during deserialization", () => {
      const { deserializer } = serdeStringifiedNum(testedNumber);
      vi.mocked(mockParentBitArray.consumeBool).mockReturnValue(false);

      const result = deserializer(mockParentBitArray);
      expect(typeof result).toBe("string");
    });
  });
});
