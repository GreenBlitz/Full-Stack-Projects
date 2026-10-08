import express from "express";
import { number, string } from "io-ts";
import { randomInt } from "node:crypto";

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-password");

  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

const checkIfItsARealDuck: express.RequestHandler = (_req, res, next) => {
  if (typeof _req.body.name !== "string" || _req.body.name === "") {
    res.status(400).json({ message: "Please enter a name." });
    return;
  }
  if (typeof _req.body.color !== "string" || _req.body.color === "") {
    res.status(400).json({ message: "Please enter a color." });
    return;
  }
  if (typeof _req.body.age !== "number" || _req.body.age < 0) {
    res.status(400).json({ message: "Age must be zero or greater." });
    return;
  }
  next();
};

const requirePassword: express.RequestHandler = (_req, res, next) => {
  if (_req.get("x-api-password") !== "pass123") {
    res.sendStatus(401);
    return;
  }
  next();
};

app.use((_req, res, next) => {
  console.log(`${_req.method} ${_req.path}`);
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
  { name: "peck", age: 5, color: "black", id: 23 },
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
  const usedIds = new Set(ducks.map((duck) => duck.id));
  let id = 1;
  while (usedIds.has(id)) {
    id++;
  }
  return id;
}

app.post("/ducks", requirePassword, checkIfItsARealDuck, (req, res) => {
  const temp: Duck = {
    name: req.body.name,
    color: req.body.color,
    age: req.body.age,
    id: findNewID(),
  };
  ducks.push(temp);
  res.status(201).json({
    message: "duck received!",
    student: req.body,
  });
});

app.delete("/ducks/:id", requirePassword, (req, res) => {
  const id = Number(req.params.id);
  const duckIndex = ducks.findIndex((currentDuck) => currentDuck.id === id);
  if (duckIndex === -1) {
    res.status(404).json({ message: "Duck not found" });
    return;
  }
  const [deletedDuck] = ducks.splice(duckIndex, 1);
  res.status(200).json({ message: "Duck deleted", duck: deletedDuck });
});

app.patch("/ducks/:id", requirePassword, (req, res) => {
  const id = Number(req.params.id);
  const duck = ducks.find((currentDuck) => currentDuck.id === id);

  if (!duck) {
    res.status(404).json({ message: "Duck not found" });
    return;
  }

  const updates = req.body as Partial<Omit<Duck, "id">>;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ message: "Provide duck fields to update" });
    return;
  }

  if (updates.name !== undefined) {
    duck.name = updates.name;
  }
  if (updates.color !== undefined) {
    duck.color = updates.color;
  }
  if (updates.age !== undefined) {
    duck.age = updates.age;
  }

  res.status(200).json({ message: "Duck updated", duck });
});

app.get("/ducks/color", (req, res) => {
  const { color } = req.query;
  if (typeof color !== "string") {
    res.status(400).json({ message: "Provide a color query parameter" });
    return;
  }
  const temp = ducks.filter((ducks) => ducks.color === color);
  res.status(200).json(temp);
});

app.get("/ducks/age", (req, res) => {
  const { age: ageQuery } = req.query;
  if (typeof ageQuery !== "string") {
    res.status(400).json({ message: "Provide a age query parameter" });
    return;
  }
  const age = Number(ageQuery);
  if (!Number.isFinite(age)) {
    res.status(400).json({ message: "Age must be a valid number" });
    return;
  }

  const temp = ducks.filter((duck) => duck.age === age);
  res.status(200).json(temp);
});

// bakcend 3333333 try and catch

app.get("/doNothing", (req, res) => {
  const temp: number = 1;
  if (temp === 1) {
    res.status(400).json({ message: "unlucky" });
    return;
  }
  res.send("tretr");
});
