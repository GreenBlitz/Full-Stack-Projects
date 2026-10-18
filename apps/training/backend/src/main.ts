import express from "express";
import helmet from "helmet";
import cors from "cors";
import { some } from "fp-ts/lib/OptionT";
import { dialogflow } from "googleapis/build/src/apis/dialogflow";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.listen(3001, () => {
  console.log("Server is running!");
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

interface DuckProps {
  name: string;
  color: string;
  age: number;
}

const ducks: DuckProps[] = [
  { name: "Ido", color: "White", age: 15 },
  { name: "Zib", color: "Idk What Color I Am", age: 15 },
  { name: "Adam Dar", color: "Yellow", age: 16 },
];

app.get("/ducks", (req, res) => {
  res.send(ducks);
});

app.get("/ducks/:name", (req, res) => {
  const { name } = req.params;
  const duck = ducks.find((d) => {
    if (name === d.name) return d;
  });
  res.send(duck);
});

app.post("/ducks", (req, res) => {
  ducks.push(req.body);
  res.send(req.body);
});

app.delete("/ducks/:name", (req, res) => {
  if (req.params.name) res.status(204).json(req.params);
  else res.status(404).json("Duck not found!");
});

app.patch("/ducks/:name", (req, res) => {
  const duck = ducks.find((duckToFind) => req.params.name);
  if (!duck) res.status(404).json("Duck not found");
  else {
    const updates = req.body;
    for (let key in updates) {
      if (duck[key] !== undefined) {
        duck[key] = updates[key];
      }
    }
    res.json(duck);
  }
});

app.get("/ducks", (req, res) => {
  const filteredDucks = [...ducks];
  if (req.query.name)
    filteredDucks.filter((duck) => duck.name === req.query.name);
  if (req.query.color)
    filteredDucks.filter((duck) => duck.name === req.query.color);
  if (req.query.age)
    filteredDucks.filter((duck) => duck.age + "" === req.query.age);
  res.send(filteredDucks);
});
