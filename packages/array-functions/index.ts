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

const MEDIAN_LOCATION = 2;
export const calculateMedian = <T>(
  arr: T[],
  transformation: (value: T) => number,
): T =>
  arr
    .map((item) => ({ item, value: transformation(item) }))
    .sort((a, b) => a.value - b.value)[Math.floor(arr.length / MEDIAN_LOCATION)]
    .item;

export const getMax = <T>(arr: T[], transformation: (value: T) => number): T =>
  arr
    .map((item) => ({ value: transformation(item), item }))
    .reduce((max, curr) => (curr.value > max.value ? curr : max)).item;

const FIRST_ELEMENT_ID = 0;
const SECOND_ELEMENT_ID = 1;
const LAST_ELEMENT_BACKWARDS_INDEX = 1;
export const firstElement = <T>(arr: T[]): T => arr[FIRST_ELEMENT_ID];
export const secondElement = <T>(arr: T[]): T => arr[SECOND_ELEMENT_ID];
export const lastElement = <T>(arr: T[]): T =>
  arr[arr.length - LAST_ELEMENT_BACKWARDS_INDEX];

const EMPTY_ARRAY_LENGTH = 0;
export const isEmpty = (arr: unknown[]): boolean =>
  arr.length === EMPTY_ARRAY_LENGTH;

export const mapObject = <K extends string, A, B>(
  obj: Record<K, A>,
  transformation: (value: A,key: K) => B,
): Record<K, B> => {
  /* 
   these eslint warnings are because 
   entries and fromEntries
   dont save the type of the keys they get
  */
  const entries: [K, B][] = Object.entries<A>(obj).map(([key, value]) => [
    key as K,
    transformation(value,key as K),
  ]);

  return Object.fromEntries(entries) as unknown as Record<K, B>;
};
