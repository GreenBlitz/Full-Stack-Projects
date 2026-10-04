import "./index.css";
const name: string = "gree";
const color: string = "red";
const age: number = 5;
export function DuckCard() {
  return (
    <span>{"name is: " + name + "color is: " + color + "age is :" + age}</span>
  );
}

interface Duck {
  name: string;
  color: string;
  age: number;
}

export function Badge1({ name, color, age }: Duck) {
  return <span>{name + color + age}</span>;
}

<Badge1 name="cutiePatotie" color="yellow" age={3} />;

export function Ducks1(ducks: Duck[]) {
  return (
    <div>
      {ducks.map((duck) => (
        <Badge1 name={duck.name} color={duck.color} age={duck.age} />
      ))}
    </div>
  );
}
