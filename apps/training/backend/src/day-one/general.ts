// 1
function greet(name: string): string {
    return `Welcome, ${name}!`;
}

// 2
function sum(a: number, b: number): number {
    return a + b;
}

// 3
function factorial(n: number): number {
    if (n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

// 4
function isEven(n: number): boolean {
    return n % 2 == 0;
}

// 5
function reverseString(s: string): string {
    var res: string = "";

    for (let i = 1; i < s.length; i++) {
        res += s[s.length - i];
    }
    return res;
}

// 6
function getFullName(firstName: string, lastName: string): string {
    return firstName + lastName;
}

// 7
function averageGrade(grades: number[]): number {
    let sum = 0;
    for (const grade of grades) {
        sum += grade;
    }
    let avg = sum / grades.length;

    return Math.round(avg * 100) / 100;
}

// 8
function isPalindrome(str: string): boolean {
    return reverseString(str) == str;
}

// 9
function findMax(numbers: number[]): number {
    const max = Math.max(...numbers);
    return max;
}

// 10
function sumPositiveNumbers(numbers: number[]): number {
    let sum: number = 0;
    for (const number of numbers) {
        if (number > 0) sum += number;
    }

    return sum;
}

// 11
function getLongestString(strings: string[]): string {
    let longest = '';

    for (const s of strings) {
        if (s.length > longest.length) longest = s;
    }

    return longest;
}

// 12
function calculateDiscount(price: number, discount: number): number {
    return discount * 1/100 * price;
}

// 13
function findSecondLargest(numbers: number[]): number {
    let max = findMax(numbers);
    let res = 0;

    for (const n of numbers) {
        if (n > res && n < max) res = n;
    }
    
    return res;
}
