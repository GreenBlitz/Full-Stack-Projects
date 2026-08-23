//1
function greet(name: string) {
    console.log("Welcome, "+name);
}
//2
function sum(a: number, b: number): number {
    return a+b;
}
//3
function factorial(n: number): number {
    let x=1;
    for(let i=n; i!==2; i--){
        x*=n;
    }
    return x;
}
//4
function isEven(n: number): boolean {
    return n%2===0;
}
//5
function reverseString(s: string): string {
    let s2 = "";
    for(let i = s.length-1; i>-1; i--){
        s2+=s[i];
    }
    return s2;
}
//6
function getFullName(firstName: string, lastName): string {
    return firstName+" "+lastName;
}
//7
function averageGrade(grades: number[]): number {
    let total=0;
    for(let i=0; i<grades.length; i++){
        total+=grades[i];
    }
    return total/grades.length;
}
//8
function isPalidrome(str: string): boolean {
    for(let i = 0; i<str.length/2; i++){
        if(str[i]!==str[str.length-i-1]){
            return false;
        }
    }
    return true;
}
//9
function findMaxEivar(numbers: number[]): number {
    let max=0;
    for(let i=0; i<numbers.length; i++){
        if(max<numbers[i]) max=numbers[i];
    }
    return max;
}
//10
function sumPositiveNumbers(numbers: number[]): number{
    let sum=0;
    for(let i=0; i<numbers.length; i++){
        if(numbers[i]>0) sum+=numbers[i];
    }
    return sum;
}
//11
function getLongestString(words: string[]): string{
    let maxLen=0;
    let maxIdx =-1;
    for(let i=0; i<words.length; i++){
        if(maxLen<words[i].length){
            maxLen=words[i].length;
            maxIdx=i;
        }
    }
    return words[maxIdx];
}
//12
function calculateDicount(price: number, discount: number): number {
    return price*(100-discount)/100;
}
//13
function findSecondLargest(numbers: number[]): number{
    let largest=numbers[0];
    let secondLargest;
    if(numbers[1]>numbers[0]){
        largest=numbers[1];
        secondLargest=numbers[0];
    }
    else{
        secondLargest=numbers[1];
    }
    for(let i=2; i<numbers.length; i++){
        if(numbers[i]>largest){
            secondLargest=largest;
            largest=numbers[i];
        }
        else if(numbers[i]>secondLargest){
            secondLargest=numbers[i];
        }
    }
    return secondLargest;
}