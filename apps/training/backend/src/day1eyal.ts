 function greet ( name: string): string {
    return `Hello, ${name}! Welcome to the training session.`;
}
console.log(greet("joe"));

function sum(a: number, b: number): number {
    return a + b;
}
console.log(sum(9, 10));

function factorial(n: number): number {
    if (n === 0 || n === 1) {
        return 1;
    }   
    else {
        let total = 1;
        for (let i = 1; i <= n; i++) {
            total *= i;
        }
        return total;
    }  
}
console.log(factorial(7));

function isEven(num: number): boolean {
    return num % 2 === 0;
}
console.log(isEven(4)); // true

function reverseString(str: string): string {
    let temp = "";
    for (let i = str.length - 1; i >= 0; i--) {
        temp += str[i];
    }
    return temp;
}
console.log(reverseString("race car")); 

function fullNAme(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}
console.log(fullNAme("joe", "biden"));

function average(numbers: number[]): number {
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }           
    return total / numbers.length;
}
console.log(average([90,88, 92, 86, 94])); 

function ispalindrome(str: string): boolean {
    let reversed = reverseString(str);
    return str === reversed;
}
console.log(ispalindrome("racecar")); 

function findMax(numbers: number[]): number {
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }      
    return max;
}
console.log(findMax([3, 7, 2, 9, 5]));

function calculateDiscount(price: number, discountPercentage: number): number {
    return price - (price * (discountPercentage / 100));
}
console.log(calculateDiscount(25, 20));

function findmaxposition(numbers: number[]): number {
    let max = findMax(numbers);
    return numbers.indexOf(max);
}

function findsecondLargest(numbers: number[]): number {
    let largest = findMax(numbers);
    let maxPosition = findmaxposition(numbers);
    let secondLargest = numbers[0];
    for (let i = 0; i < numbers.length; i++) {
        if ( i !== maxPosition) {
            if (numbers[i] > secondLargest) {
            secondLargest = numbers[i];
            }
        }
    }
    return secondLargest;
}
console.log(findsecondLargest([3, 8, 2, 9, 5]));

// page 2

function x2(numbers: number[]): number[] {
    return numbers.map((num) => num * 2);
}
console.log(x2([1, 2, 3, 4, 5]));

function filterneg(numbers: number[]): number[] {
    return numbers.filter((num) => num > 0);
}
console.log(filterneg([2, 3, -5, 4, -1]));

function printall(names: string[]): void {
    names.forEach((name) => console.log(name));
}
printall(["joe", "biden", "donald", "trump"]);

function evenAndOdd(numbers: number[]): boolean {
    return numbers.some((num) => num % 2 === 0) && numbers.some((num) => num % 2 !== 0);
}
console.log(evenAndOdd([1, 2, 3, 4, 5]));

function biggerthan50(numbers: number[]): number {
    if (numbers.some((num) => num > 50)) {
        return numbers.find((num) => num > 50) as number;
    }
    return -1;
}
console.log(biggerthan50([10, 20, 30, 60, 430,14,8888]));

function isexist(numbers: number[], target: number): boolean {
    return numbers.includes(target);
}
console.log(isexist([1, 2, 3, 4, 5], 3));

function sumofarray(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sumofarray([1, 2, 3, 4, 5]));

function flipall(names: string[]): string[] {
    return names.map((name) => reverseString(name));
}
console.log(flipall(["joe", "biden", "donald", "trump"]));

function issame(numbers: number[]): boolean {
    if (numbers.every((num) => num >= numbers[0])) {
        return true;
    }
    return false;
}
console.log(issame([5, 75, 5, 5]));

function sumeven(numbers: number[]): number {
    return numbers.filter((num) => num % 2 === 0).reduce((acc, curr) => acc + curr, 0);
}
console.log(sumeven([1, 2, 3, 4, 5]));

function squarepositive(numbers: number[]): number[] {
    return numbers.filter((num) => num > 0).map((num) => num * num);
}
console.log(squarepositive([1, -2, 3, -4, 5]));

function biggerthan10 (numbers: number[]): number {
    return numbers.filter((num) => num > 10).length;
}  
console.log(biggerthan10([1, 2, 3, 4, 5, 11, 12, 13]));

function biggerthan100aftermultiply(numbers: number[]): number[] {
    return numbers.map((num) => num * 2).filter((num) => num > 100);
}
console.log(biggerthan100aftermultiply([10, 20, 30, 410, 51]));

function randimtasks(numbers: number[]): (number | boolean | boolean)[]  {
    let a = sumofarray(numbers);
    let b = false;
    if (numbers.filter((num) => num%2 === 0).length > 0) {
        b = true;
    }
    let c = false;
    if (numbers.every((num) => num > 0)) {
        c = true;
    }
    let temp: (number | boolean | boolean)[] = [a, b, c];
    return temp;
}
console.log(randimtasks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));