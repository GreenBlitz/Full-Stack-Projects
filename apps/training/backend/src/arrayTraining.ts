function multipllyArrayValues(numbers: number[]): number[]{
    return numbers.map(x => x * 2);
}

function onlyPositiveArray(numbers: number[]): number[]{
    return numbers.filter(x => x > 0);
}

function logArrayValues(names: string[]): void{
    names.forEach(name => console.log(name));
}

function doesArrayContainEven(numbers: number[]): boolean{
    return numbers.some((number: number) => number % 2 === 0);
}

function firstOverFifty(numbers: number[]): number {
    return numbers.find((num: number) => num > 50) ?? -1;
}

function isNumberInArray(numbers: number[], number: number): boolean{
    return numbers.includes(number);
}

function sumArray(numbers: number[]): number{
    return numbers.reduce((total: number, number: number) => total + number);
}

function onlyWordsOverLengthFive(strings: string[]): string[] {
    return strings.filter((string: string) => string.length > 5);
}

function reverseStringInArray(strings: string[]){
    return strings.map((string: string) => string.split("").reverse().join(""));
}

function areAllEven(numbers: number[]): boolean{
    return numbers.every((number: number) => number % 2 === 0);
}

function sumAllEven(numbers: number[]): number{
    return numbers.filter((number: number) => number % 2 === 0).reduce((total: number, number: number) => total + number);
}

function squareAllPositive(numbers: number[]): number[]{
    return numbers.filter((number: number) => number > 0).map((number: number) => number * number);
}

function howManyBiggerThanTen(numbers: number[]): number{
    return numbers.filter((number: number) => number > 10).length;    
}

function biggerThanHundrendMultiplied(numbers: number[]): number[] {
    return numbers.filter((number: number) => number > 100).map((number: number) => number * 2);
}

let strings: string[] = ["one", "Karni", "another string"];
let numbers: number[] = [1, -3, -5, 2, 210, -9, 4, 5, -1, 53, 90, -101];

console.log(multipllyArrayValues(numbers));
console.log(onlyPositiveArray(numbers));
console.log(logArrayValues(strings));
console.log(doesArrayContainEven(numbers));
console.log(firstOverFifty(numbers));
console.log(isNumberInArray(numbers, 4));
console.log(sumArray(numbers));
console.log(onlyWordsOverLengthFive(strings));
console.log(reverseStringInArray(strings));
console.log(areAllEven(numbers));
console.log(sumAllEven(numbers));
console.log(squareAllPositive(numbers));
console.log(howManyBiggerThanTen(numbers));
console.log(biggerThanHundrendMultiplied(numbers));

