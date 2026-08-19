function greet(name: string):string {
    return("hello"+ name);
}

function sum(a: number,b:number):number {
const numcount= a+b;
    return(numcount);
}

function factorial(n:number):number {
const num2= n!;
    return(num2);
}
 function isEven(n:number):boolean{
    return n % 2 == 0;
 }

 function reversestring(sen: string){
    let new= "";
    for(let i = 1;i<sen.length+1;i++){
        new += sen[sen.length-i];
}
return(new);

console.log (new);

function getFullName(firstname:string,lastname:string):string{
const fullname= firstname + lastname;
    return(fullname);
}
function averageGrade(grades:number[]):number{
const average= grades/grades.length
return(average)
}
function ispalindrom(str:string):boolean{
    let new= "";
    for(let i = 1;i<str.length+1;i++){
        new += str[str.length-i];
    return(new==str)   
}
function findmaxeivar(numbers:number[]){
    let max= numbers[0]
    for (let i = 1;i<numbers.length+1;i++) {
        if (numbers[i]>max){
            max=numbers[i];
        return max
}
function sumpositiveNumbers(numbers:number[]){
    let sum=""
    for(let i=1; i<numbers.length;i++){
        if (numbers[i]%2==0){
            sum+=i;
        }}
    return sum
function getLongestString(words:string[]){
let hello=words[0].length
    for(let i=1; i<words.length;i++){
        if (words[i].length>hello){
            let hello=words[i]
        }
    return(hello)
function calculate(price:number,discount:number){
const newprice= price- price*(discount/100)
    return(newprice)
}
function findSecondLargest(numbers:number[]){
    let max1=numbers[0]
    let max2==0
    for(let i=1;i<numbers.length;i++){
        if(numbers[i]>max[1]){
            max2=max1
            max1=numbers[i]
        return(max2)
    

    }








        


    }


