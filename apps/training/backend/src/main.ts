import express, { type Express } from "express";

const app: Express = express();
const port = 3000;

app.use(express.json());

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

app.get("/", (_req, res) => {
  res.send("Welcome!");
});

app.get("/ducks", (_req, res) => {
  res.send(ducks);
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
  const [name, color, age] = req.body;
  const id = ducks.at(-1)?.id ?? 1;
  const duck: Duck = { id, name, color, age };
  ducks.push(duck);
  res.status(200).send(duck);
});

app.delete("/ducks/:id", (req, res) => {
  const id = Number(req.params.id);
  ducks = ducks.filter((duck) => duck.id !== id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
