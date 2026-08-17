function greet(name: string) {
  console.log(`Hello ${name}!`);
}

function sum(a: number, b: number) {
  return a + b;
}

function factorial(n: number) {
  let factorial = 1;
  for (let i = 1; i <= n; i++) {
    factorial = factorial * i;
  }
  return factorial;
}

function reverseString(string: string) {
  let reversedString = "";
  for (let i = string.length - 1; i >= 0; i--) {
    reversedString += string.charAt(i);
  }
  return reversedString;
}

function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

function averageGrade(grades: number[]) {
  return sumArray(grades) / grades.length;
}

function isPalindrome(str: string) {
  return str === reverseString(str);
}

function findMaxValue(numbers: number[]): number {
  let max = numbers[0];
  numbers.forEach((number) => {
    if (number > max) {
      max = number;
    }
  });
  return max;
}

function sumPositiveNumbers(numbers: number[]) {
  let sum = 0;
  numbers.forEach((number) => {
    if (number > 0) {
      sum += number;
    }
  });
  return sum;
}

function getLongestString(words: string[]) {
  let longestString = words[0];
  words.forEach((word) => {
    if (word.length > longestString.length) {
      longestString = word;
    }
  });
  return longestString;
}

function calculateDiscount(price: number, discountPercentage: number) {
  return (price * (100 - discountPercentage)) / 100;
}

function findSecondLargest(numbers: number[]) {
  const largestValue = findMaxValue(numbers);
  const largestIndex = numbers.findIndex((number) => number === largestValue);
  numbers[largestIndex] = -Number.MAX_SAFE_INTEGER;
  const secondLargestValue = findMaxValue(numbers);
  numbers[largestIndex] = largestValue;
  return secondLargestValue;
}

function doubleArray(numbers: number[]) {
  return numbers.map((number) => number * 2);
}

function positiveOnly(numbers: number[]) {
  return numbers.filter((number) => number > 0);
}

function printAll(names: string[]) {
  names.forEach((name) => console.log(name));
}

function hasEven(numbers: number[]) {
  return numbers.some((number) => number % 2 === 0);
}

function firstLargerThanFifty(numbers: number[]) {
  return numbers.find((number) => number > 50);
}

function isExist(numbers: number[], value: number) {
  return numbers.includes(value);
}

function sumArray(numbers: number[]) {
  return numbers.reduce((sum, number) => sum + number, 0);
}

function longerThanFive(strings: string[]) {
  return strings.filter((string) => string.length > 5);
}

function reverseEach(strings: string[]) {
  return strings.map(reverseString);
}

function allPositive(numbers: number[]) {
  return numbers.every((number) => number > 0);
}

function sumAllEven(numbers: number[]) {
  return sumArray(numbers.filter((number) => number % 2 === 0));
}

function squareAllPositive(numbers: number[]) {
  return numbers
    .filter((number) => number > 0)
    .map((number) => number * number);
}

function largerThanTenAmount(numbers: number[]) {
  return numbers.filter((number) => number > 10).length;
}

function doubledLargerThanHundred(numbers: number[]) {
  return doubleArray(numbers.filter((number) => number > 100));
}

function analizeNumbers(numbers: number[]) {
  return [sumArray(numbers), hasEven(numbers), positiveOnly(numbers)];
}
