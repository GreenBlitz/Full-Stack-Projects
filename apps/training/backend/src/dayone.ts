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


}