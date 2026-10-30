import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const ducks: DuckProps[] = [
  { name: "Ido", color: "White", age: 15 },
  { name: "Zib", color: "Idk What Color I Am", age: 15 },
  { name: "Adam Dar", color: "Yellow", age: 16 },
];

app.listen(4590, () => {
  console.log("Server is running!");
});

app.use("/ducks", (req, res, next) => {
  console.log(req.method + " request made to " + req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

interface DuckProps {
  name: string;
  color: string;
  age: number;
}

app.get("/ducks/:name", (req, res) => {
  const { name } = req.params;
  const duck = ducks.find((d) => {
    if (name === d.name) return d;
  });
  res.send(duck);
});

app.post(
  "/ducks",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
      next("route");
    }
  },
  (req, res) => {
    ducks.push(req.body);
    res.send(req.body);
  },
);

app.delete(
  "/ducks/:name",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
      next("route");
    }
  },
  (req, res) => {
    const idx = ducks.findIndex((duck) => duck.name === req.params.name);

    if (idx === -1) {
      return res.status(404).json({ message: "Duck not found!" });
    }

    const [deletedDuck] = ducks.splice(idx, 1);
    return res.json({ name: deletedDuck.name });
  },
);

app.patch(
  "/ducks/:name",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
      next("route");
    }
  },
  (req, res) => {
    const duck = ducks.find((duck) => req.params.name === duck.name);
    if (!duck) res.status(404).json({ message: "Duck not found" });
    else {
      if (req.body.duck.age) duck.age = req.body.duck.age;
      if (req.body.duck.color) duck.color = req.body.duck.color;
      if (req.body.duck.name) duck.name = req.body.duck.name;
      res.json(duck);
    }
  },
);

app.get("/ducks", (req, res) => {
  const filteredDucks = [...ducks];
  for (let i = 0; i < filteredDucks.length; i++) {
    if (req.query.name)
      if (req.query.name !== filteredDucks[i].name) filteredDucks.splice(i, 1);
    if (req.query.age)
      if (Number(req.query.age) !== filteredDucks[i].age)
        filteredDucks.splice(i, 1);
    if (req.query.color)
      if (req.query.color !== filteredDucks[i].color)
        filteredDucks.splice(i, 1);
  }
  res.json({ filteredDucks: filteredDucks, ducks: ducks });
});
