import "./index.css";
const name: string = "gree";
const color: string = "red";
const age: number = 5;
export function DuckCard() {
  return (
    <span>{"name is: " + name + "color is: " + color + "age is :" + age}</span>
  );
}

export interface Duck {
  name: string;
  color: string;
  age: number;
}
