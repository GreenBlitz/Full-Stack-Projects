// בס"ד
const defaultStartingSumValue = 0;
export const calculateSum = <T>(
  arr: T[],
  transformation: (value: T) => number,
  startingSumValue = defaultStartingSumValue,
): number => arr.reduce((sum, value) => sum + transformation(value), startingSumValue);
