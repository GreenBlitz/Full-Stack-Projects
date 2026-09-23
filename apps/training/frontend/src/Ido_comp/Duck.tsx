///1

export interface DuckProps {
  name: string;
  colour: string;
  age: number;
}

// const the_duck_list = [
//   { name: "Asaf", colour: "red", age: 250 },
//   { name: "Daniel", colour: "blue", age: 18 },
//   { name: "Maya", colour: "green", age: 32 },
//   { name: "Noam", colour: "yellow", age: 45 },
//   { name: "Liam", colour: "purple", age: 27 },
//   { name: "Sarah", colour: "orange", age: 63 },
//   { name: "Ethan", colour: "black", age: 21 },
//   { name: "Ariel", colour: "pink", age: 16 },
//   { name: "David", colour: "white", age: 38 },
//   { name: "Emma", colour: "cyan", age: 29 },
// ];

export function Duck({ name, colour, age }: DuckProps) {
  let txt = "name: " + name + ", colour: " + colour + ", age: " + age;
  return (
    <>
      <h1>{txt}</h1>
    </>
  );
}
