
const the_duck_list = [
  { name: "Asaf", colour: "red", age: 250 },
  { name: "Daniel", colour: "blue", age: 18 },
  { name: "Maya", colour: "green", age: 32 },
  { name: "Noam", colour: "yellow", age: 45 },
  { name: "Liam", colour: "purple", age: 27 },
  { name: "Sarah", colour: "orange", age: 63 },
  { name: "Ethan", colour: "black", age: 21 },
  { name: "Ariel", colour: "pink", age: 16 },
  { name: "David", colour: "white", age: 38 },
  { name: "Emma", colour: "cyan", age: 29 },
];

const the_html_duck_list = the_duck_list.map((the_duck) => {
  const string_duck: string = "name: " + the_duck.name + ", colour: " + the_duck.colour + ", age: " + the_duck.age
  return string_duck;
});

