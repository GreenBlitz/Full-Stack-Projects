// בס"ד
/* eslint-disable @typescript-eslint/unbound-method */
import { mock } from "vitest-mock-extended";
import { serdeBool } from "./serde-bool"; // Adjust path accordingly
import type { BitArray } from "../BitArray";
import { describe, it, expect, vi } from "vitest";

describe("serdeBool", () => {
  // Create a mock BitArray to simulate the buffer

  describe("serializer", () => {
    it("should call insertBool with true", () => {
      const mockBitArray = mock<BitArray>();

      const { serializer } = serdeBool();

      serializer(mockBitArray, true);

      const expectedBooleanInserts = 1;

      expect(mockBitArray.insertBool).toHaveBeenCalledWith(true);
      expect(mockBitArray.insertBool).toHaveBeenCalledTimes(
        expectedBooleanInserts
      );
    });

    it("should call insertBool with false", () => {
      const mockBitArray = mock<BitArray>();

      const { serializer } = serdeBool();

      serializer(mockBitArray, false);

      expect(mockBitArray.insertBool).toHaveBeenCalledWith(false);
    });
  });

  describe("deserializer", () => {
    it("should return true when consumeBool returns true", () => {
      const mockBitArray = mock<BitArray>();

      vi.mocked(mockBitArray.consumeBool).mockReturnValue(true);

      const { deserializer } = serdeBool();
      const isResultTrue = deserializer(mockBitArray);

      const expectedBooleanConsumptions = 1;

      expect(isResultTrue).toBe(true);
      expect(mockBitArray.consumeBool).toHaveBeenCalledTimes(
        expectedBooleanConsumptions
      );
    });

    it("should return false when consumeBool returns false", () => {
      const mockBitArray = mock<BitArray>();

      vi.mocked(mockBitArray.consumeBool).mockReturnValue(false);

      const { deserializer } = serdeBool();
      const isResultTrue = deserializer(mockBitArray);

      expect(isResultTrue).toBe(false);
    });
  });
});
