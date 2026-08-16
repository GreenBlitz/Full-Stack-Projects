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
    for (let i = 1; i < str.length + 1; i++) {
        if (str[i] !== str[str.length-i]){
            newbull = false
        }
    }
    return newbull;
}

console.log(isPalindrome("see"))

9
