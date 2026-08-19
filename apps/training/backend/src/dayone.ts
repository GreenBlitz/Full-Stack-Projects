1
function greet(name: string) {
    const newname = "Welcome " + name;
    return newname;
}

console.log(greet("Ido"))

2
function sum(a: number, b: number) {
    const newsum = a + b;
    return newsum;
}

console.log(sum(3, 4))

3
function fact(n: number) {
    let newfact = 1;
    for (let i = 1; i < (n+1); i++){
        newfact = newfact * i;
    }
    return newfact;
}   

console.log(fact(5))

4
function isEven(n: number) {
    let bull = true;
    if (n%2 === 1){
        bull = false;
    }
    return bull;
}

console.log(isEven(5))

// 5
function reverseString(s: string){
    let newstring = ""
    for (let i = 1; i < s.length + 1; i++) {
        newstring += s[s.length-i];
    }
    return newstring;
}

console.log(reverseString("abc"))

6
function getFullName(firstName: string, lastName: string){
    const fullname = firstName + " " + lastName;
    return fullname;
}

console.log(getFullName("Ido", "Arzi"));

7
function averageGrade(grades: number[]): number{
    let avr = 0;
    for (let i = 0; i < grades.length + 1; i++){
        avr += grades[i];
    }
    avr = avr/grades.length;
    return avr;
}

const nums: number[] = [96, 76, 87, 93, 85, 91]
console.log(averageGrade(nums))

8 
function isPalindrome(str: string){
        let newbull = true
     if (str !== reverseString(str)){
        newbull = false
    }
    return newbull;
}

console.log(isPalindrome("see"))

9

function findMaxEivar(numbers: number[]){
    let max = numbers[0];
    for (let i = 1; i < numbers.length ; i++){
        if (numbers[i] > max){
            max = numbers[i];
        }
    }
    return max
}

const val: number[] = [4, 6, 7];
console.log(findMaxEivar(val));

10

function sumPositiveNumbers(numbers: number[]) {
    let pozsum = 0
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > 0) {
            pozsum += numbers[i]
        }
    }
    return pozsum
}

const num2: number[] = [-7, 9, 10, -1, 70]
console.log(sumPositiveNumbers(num2))

11

function getLongestString(words: string[]) {
    let max_l = words[0].length;
    for (let i = 1; i < words.length; i++) {
        if (words[i].length > max_l) {
            max_l = words[i].length;
        }
    }
    return max_l;
}

const txt: string[] = ["hi", "what's up", "R U good?"];
console.log(getLongestString(txt));

12

function calculateDiscount(price: number, discount: number) {
    let r_dis = 1 - discount
    r_dis = r_dis * price
    return r_dis
}

const pri = 100
const dis = 0.15
console.log(calculateDiscount(pri, dis))

13

function findSecondLargest(numbers: number[]) {
    let r_max = numbers[0];
    let s_max = 0
    for (let i = 1; i < numbers.length ; i++){
        if (numbers[i] > r_max){
            s_max = r_max
            r_max = numbers[i];
        }
    }
    return s_max
}

console.log(findSecondLargest(num2))

//part 2

console.log(" ")
console.log("part 2")
console.log(" ")

1

const val2: number[] = [1, 2, 4, 8, 16];
const doubled = val2.map((num) => num * 2);
console.log(doubled);


2

const val3: number[] = [1, -1, 2, -2, 3, -3];
const filtered = val3.filter(num => num > 0);
console.log(filtered);


3

const txt2s: string[] = ["I", "Im", "Hello", "what's up"];
txt2s.forEach((txt2) => {
    console.log(txt2);
});

console.log(" ")

4

const number: number[] = [1, 3, 5, 6];
const someeven = number.some(num => num % 2 == 0);
console.log(someeven)

console.log(" ")

5
const number2: number[] = [10, 20, 30, 40, 50, 60, 70];
const first_more_then_50 = number2.find(num => num > 50)
console.log(first_more_then_50)

console.log(" ")

6

function includes(numbers: number[], num) {
    let re = false;
    re = numbers.includes(num);
    return re
}

console.log(includes(number2, 9))
