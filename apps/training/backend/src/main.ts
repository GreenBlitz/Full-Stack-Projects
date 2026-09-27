import express from "express";

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

app.listen(3001, () => {
  console.log("Server is wasdawsdasdawdsaddwasdwasdwasdasddaddasdw running!");
});

app.get("/student", (req, res) => {
  res.json({ name: "abcda", grade: 95 });
});

app.get("/school", (req, res) => {
  res.json({ name: "gregory", city: "joevile", students: "abdaabdaaaabda" });
});

app.post("/students", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    message: "Student received!",
    student: req.body,
  });
});

// back to duck

interface Duck {
  name: string;
  color: string;
  age: number;
  id: number;
}

const ducks: Duck[] = [
  { name: "joe", age: 29, color: "brown", id: 2 },
  { name: "daisy", age: 3, color: "yellow", id: 12 },
  { name: "quickers", age: 5, color: "white", id: 1 },
  { name: "mallard", age: 2, color: "green", id: 3 },
  { name: "puddles", age: 1, color: "yellow", id: 5 },
  { name: "waddles", age: 4, color: "black", id: 6 },
  { name: "feather", age: 6, color: "grey", id: 7 },
  { name: "beaky", age: 2, color: "brown", id: 33 },
  { name: "splash", age: 3, color: "white", id: 55 },
  { name: "peck", age: 5, color: "speckled", id: 23 },
  { name: "charlie", age: 7, color: "yellow", id: 44 },
];

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/ducks", (req, res) => {
  res.json(ducks);
});

app.get("/duck/:name", (req, res) => {
  const { name } = req.params;
  const duck = ducks.find((currentDuck) => currentDuck.name === name);
  if (!duck) {
    res.status(404).json({ message: "Duck not found" });
    return;
  }
  res.json(duck);
});

function findNewID() {
  let i = 0;
  let b = true;
  while (b) {
    i += 1;
    for (let index = 0; index < ducks.length; index++) {
      if (ducks[i].id !== i) {
        b = false;
      }
    }
  }
  return i;
}

app.post("/ducks", (req, res) => {
  const temp: Duck = {
    name: req.body.name,
    color: req.body.color,
    age: req.body.age,
    id: findNewID(),
  };
  ducks.push(temp);
  res.status(201).json({
    message: "Student received!",
    student: req.body,
  });
});
