import express, { type Express } from "express";

const app: Express = express();
const port = 3000;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(req.method + " " + req.path + " at " + Date.now());
  next();
});

app.use((req, res, next) => {
  if (req.header("duck-password") === "password" || req.method === "get") {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.use((req, res, next) => {
  if ("name" in req.body) {
    const name = req.body.name;
    if (typeof name !== "string" || !name) {
      res.sendStatus(400);
    }
  }
  if ("color" in req.body) {
    const color = req.body.color;
    if (typeof color !== "string" || !colors.includes(color)) {
      res.sendStatus(400);
    }
  }
  if ("age" in req.body) {
    const age = req.body.age;
    if (typeof age !== "number" || age < 0) {
      res.sendStatus(400);
    }
  }
  next();
});

interface Duck {
  id: number;
  name: string;
  color: string;
  age: number;
}

let ducks: Duck[] = [
  { id: 0, name: "Momo", color: "yellow", age: 67 },
  { id: 1, name: "Donald", color: "white", age: 21 },
  { id: 2, name: "Daffy", color: "black", age: 41 },
];

const colors: string[] = [
  "red",
  "orange",
  "brown",
  "yellow",
  "green",
  "blue",
  "purple",
  "green",
  "pink",
  "white",
  "gray",
  "black",
];

app.get("/", (_req, res) => {
  res.send("Welcome!");
});

app.get("/ducks", (req, res) => {
  let sentDucks = ducks;
  if ("name" in req.query && typeof req.query.name === "string") {
    const name = req.query.name;
    sentDucks = sentDucks.filter((d) => {
      return d.name.toLowerCase().includes(name.toLowerCase());
    });
  }
  if ("color" in req.query && typeof req.query.color === "string") {
    const color = req.query.color;
    sentDucks = sentDucks.filter((d) => {
      return d.color.toLowerCase().includes(color.toLowerCase());
    });
  }
  if ("age" in req.query && typeof req.query.age === "string") {
    const age = req.query.age;
    sentDucks = sentDucks.filter((d) => {
      return d.age.toString().toLowerCase().includes(age.toLowerCase());
    });
  }
  res.send(sentDucks);
});

app.get("/ducks/:id", (req, res) => {
  const duck = ducks.find((duck: Duck) => duck.id === Number(req.params.id));
  if (duck) {
    res.send(duck);
  } else {
    res.sendStatus(404);
  }
});

app.post("/ducks", (req, res) => {
  try {
    const name: string = req.body.name;
    const color: string = req.body.color;
    const age: number = req.body.age;
    const id = ducks.at(-1)?.id ?? 1;
    const duck: Duck = { id, name, color, age };
    ducks.push(duck);
    res.status(201).send(duck);
  } catch (Error) {
    res.sendStatus(400);
  }
});

app.delete("/ducks/:id", (req, res) => {
  const id = Number(req.params.id);
  ducks = ducks.filter((duck) => duck.id !== id);
  res.sendStatus(200);
});

app.patch("/ducks/:id", (req, res) => {
  const duck = ducks.find((duck: Duck) => duck.id === Number(req.params.id));
  if (duck) {
    if ("name" in req.body && typeof req.body.name === "string") {
      duck.name = req.body.name;
    }
    if ("color" in req.body && typeof req.body.color === "string") {
      duck.color = req.body.color;
    }
    if ("age" in req.body && typeof req.body.age === "number") {
      duck.age = req.body.age;
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
