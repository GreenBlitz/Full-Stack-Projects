// בס"ד

const defaultRangeStart = 0;
export const rangeArr = (
  length: number,
  rangeStart = defaultRangeStart
): number[] => {
  return Array.from({ length }).map((zero, i) => i + rangeStart);
};

export const BIT_ARRAY_LENGTH = 8;
const FIRST_BIT_SELECTOR = 1;

export class BitArray {
  private boolArr: boolean[];
  private bitCount: number;

  public constructor(arr?: Uint8Array) {
    this.bitCount = 0;
    this.boolArr = [];
    if (arr) {
      this.insertUInt8Array(arr, arr.length * BIT_ARRAY_LENGTH);
    }
  }

  public insertUInt8Array(data: Uint8Array, totalBitCount: number): void {
    rangeArr(totalBitCount).forEach((i) => {
      const currentNumber = data[Math.floor(i / BIT_ARRAY_LENGTH)];
      const bitSelector = FIRST_BIT_SELECTOR << i % BIT_ARRAY_LENGTH;
      this.boolArr.push(
        Boolean((currentNumber & bitSelector))
      );
    });
    this.bitCount += totalBitCount;
  }
  public insertBitArray(bitArray: BitArray): void {
    this.boolArr = this.boolArr.concat(bitArray.boolArr);
    this.bitCount += this.bitCount;
  }

  public consumeBits(bitCount: number): Uint8Array {
    const returnedArr = new Uint8Array(Math.ceil(bitCount / BIT_ARRAY_LENGTH));
    rangeArr(bitCount).forEach((i) => {
      returnedArr[Math.floor(i / BIT_ARRAY_LENGTH)] |=
        Number(this.boolArr.shift()) << i % BIT_ARRAY_LENGTH;
    });
    this.bitCount -= bitCount;
    return returnedArr;
  }

  public insertBool(bool: boolean): void {
    this.boolArr.push(bool);
    this.bitCount++;
  }

  public consumeBool(): boolean {
    this.bitCount--;
    return Boolean(this.boolArr.shift());
  }

  public consume(): Uint8Array {
    return this.consumeBits(this.bitCount);
  }
}
