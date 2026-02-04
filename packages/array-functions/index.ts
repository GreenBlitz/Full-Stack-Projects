// בס"ד
const defaultStartingSumValue = 0;
export const calculateSum = <T>(
  arr: T[],
  transformation: (value: T) => number,
  startingSumValue = defaultStartingSumValue,
): number =>
  arr.reduce((sum, value) => sum + transformation(value), startingSumValue);

export const calculateAverage = <T>(
  arr: T[],
  transformation: (value: T) => number,
): number => calculateSum(arr, transformation) / arr.length;

export const getMax = <T>(arr: T[], transformation: (value: T) => number): T =>
  arr
    .map((item) => ({ value: transformation(item), item }))
    .reduce((max, curr) => (curr.value > max.value ? curr : max)).item;

const FIRST_ELEMENT_ID = 0;
const LAST_ELEMENT_BACKWARDS_INDEX = 1;
export const firstElement = <T>(arr: T[]): T => arr[FIRST_ELEMENT_ID];
export const lastElement = <T>(arr: T[]): T =>
  arr[arr.length - LAST_ELEMENT_BACKWARDS_INDEX];

const EMPTY_ARRAY_LENGTH = 0;
export const isEmpty = (arr: unknown[]): boolean =>
  arr.length === EMPTY_ARRAY_LENGTH;
