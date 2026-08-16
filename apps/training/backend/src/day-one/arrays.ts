// 1
function doubleArray(arr: number[]): number[] {
  return arr.map((n) => n * 2);
}

// 2
function positiveArray(arr: number[]): number[] {
  return arr.filter((n) => n > 0);
}

// 3
function printArray(arr: string[]): void {
  arr.forEach((s) => console.log(s));
}

// 4
function isElementEven(arr: number[]): boolean {
  return arr.some((n) => n % 2 == 0);
}

// 5
function elementLargerThan50(arr: number[]): number | undefined {
  return arr.find((n) => n > 50);
}

// 6
function doesInclude(arr: number[], n: number): boolean {
  return arr.includes(n);
}

// 7
function sumArray(arr: number[]): number {
  return arr.reduce((acc, value) => acc + value, 0);
}

// 8
function longerThan5(arr: string[]): string[] {
  return arr.filter((s) => s.length > 5);
}

// 9
function reverseStrings(arr: string[]): string[] {
  return arr.map((s) => reverseString(s));
}

// 10
function areEven(arr: number[]): boolean {
  return arr.every((n) => n % 2 == 0);
}

// 11
function sumEven(arr: number[]): number {
  return arr.filter((n) => n % 2 == 0).reduce((acc, value) => acc + value, 0);
}

// 12
function squarePositive(arr: number[]): number[] {
  return arr.filter((n) => n % 2 == 0).map((n) => n ^ 2);
}

// 13
function largerThan10(arr: number[]): number {
  return arr.filter((n) => n > 10).length;
}

// 14
function doubleLargerThan100(arr: number[]): number[] {
  return arr.filter((n) => n > 100).map((n) => n * 2);
}

// 15
function infoArray(arr: number[]): any[] {
  return [sumArray(arr), isElementEven(arr), areEven(arr)];
}
