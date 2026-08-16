function greet(name: string): string {
    return `welcome ${name}!`;
}

function sum(a: number, b: number): number {
    return a + b;
}

function factorial(n: number): number {
    for (let i = n - 1; i > 0; i--) {
        n *= i;
    }
    return n;
}

function isEven(n: number): boolean {
    return n % 2 == 0;
}

function reverseString(s: string): string{
    return s.split('').reverse().join('');
}

function getFullName(firstName: string, lastName: string){
    return `${firstName} ${lastName}`
}

function averageGrade(grades: number[]): number {
    let sum: number = 0;
    for (let i = 0; i < grades.length; i++){
        sum += grades[i];
    }
    return sum / grades.length;
}

function isPalindrom(s: string){
    for (let i = 0; i < s.length / 2; i++){
        if (s.charAt(i) !== s.charAt(s.length - 1 - i)){
            return false;
        }
    }
    return true;
}

function findMaxEivar(numbers: number[]): number {
    let maxEivar: number = numbers[0];
    for (let i = 1; i < numbers.length; i++){
        if (maxEivar < numbers[i]){
            maxEivar = numbers[i];
        }
    }
    return maxEivar;
}

function sumPositiveNumbers(numbers: number[]): number {
    let positiveSum: number = 0;
    for (let i = 0; i < numbers.length; i++){
        if (numbers[i] > 0){
            positiveSum += numbers[i];
        }
    }
    return positiveSum;
}

function getLongestString(words: string[]): string{
    let longestStringIndex: number = 0;
    for (let i = 0; i < words.length; i++){
        if (words[i].length > words[longestStringIndex].length){
            longestStringIndex = i;
        }
    }
    return words[longestStringIndex]
}

function calculateDiscount(price: number, discount: number): number{
    return price - price * discount / 100;
}

function findSecondLargest(numbers: number[]): number {
    numbers.sort()
    return numbers[numbers.length - 2];
}


console.log(greet("Karni")); 
console.log(sum(5, 3)); 
console.log(factorial(5)); 
console.log(isEven(8))
console.log(reverseString("Hello"))
console.log(getFullName("Jonathan", "Levi"))
console.log(isPalindrom("hihihih"))
console.log(findMaxEivar([1, 2, 5, 2, 9, 3, 0]))
console.log(sumPositiveNumbers([1, 3, -5, 8, 9, -23, 7, -2, 2]))
console.log(calculateDiscount(100, 40))
console.log(findSecondLargest([4, 5, 8, 1, 3, 0, 2]))