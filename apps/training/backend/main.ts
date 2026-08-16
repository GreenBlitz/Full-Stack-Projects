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
  let sum = 0;
  grades.map((grade, i) => (sum += grade));
  return sum / grades.length;
}

function isPalindrome(str: string) {
  return str === reverseString(str);
}

console.log(isPalindrome("dorod"));
