import express from "express";
import { Collection } from "mongodb";
import { openDatabase } from "./DuckDataBase";

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

const initialDucks: Duck[] = [
  { name: "joe", age: 29, color: "brown" },
  { name: "daisy", age: 3, color: "yellow" },
  { name: "quickers", age: 5, color: "white" },
  { name: "mallard", age: 2, color: "green" },
  { name: "puddles", age: 1, color: "yellow" },
  { name: "waddles", age: 4, color: "black" },
  { name: "feather", age: 6, color: "grey" },
  { name: "beaky", age: 2, color: "brown" },
  { name: "splash", age: 3, color: "white" },
  { name: "peck", age: 5, color: "black" },
  { name: "charlie", age: 7, color: "yellow" },
];

async function startServer() {
  const db = await openDatabase();
  duckCollection = db.collection<Duck>("ducks");

  const count = await duckCollection.countDocuments();
  if (count === 0) {
    await duckCollection.insertMany(initialDucks);
    console.log(`Inserted ${initialDucks.length} ducks`);
  }

  const port = Number(process.env.BACKEND_PORT ?? 3001);
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

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
}

let duckCollection: Collection<Duck> | undefined;

function getDuckCollection(): Collection<Duck> {
  if (!duckCollection) throw new Error("Duck collection is not connected");
  return duckCollection;
}

startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/ducks", async (req, res) => {
  try {
    const ducks = await getDuckCollection().find({}).toArray();
    res.json(ducks);
  } catch (error) {
    console.error("Failed to fetch ducks:", error);
    res.status(500).json({ message: "Failed to fetch ducks" });
  }
});

app.get("/duck/:name", async (req, res) => {
  try {
    const duck = await getDuckCollection().findOne({ name: req.params.name });
    if (!duck) {
      res.status(404).json({ message: "Duck not found" });
      return;
    }
    res.json(duck);
  } catch (error) {
    console.error("Failed to fetch duck:", error);
    res.status(500).json({ message: "Failed to fetch duck" });
  }
});

app.post("/ducks", requirePassword, checkIfItsARealDuck, async (req, res) => {
  const count = await getDuckCollection().countDocuments(
    { name: req.body.name },
    { limit: 1 },
  );
  if (count === 1) {
    res.status(409).json({ message: "A duck with that name already exists." });
    return;
  }

  const temp: Duck = {
    name: req.body.name,
    color: req.body.color,
    age: req.body.age,
  };

  await getDuckCollection().insertOne(temp);

  res.status(201).json({
    message: "duck received!",
    duck: temp,
  });
});

app.delete("/ducks/:name", requirePassword, async (req, res) => {
  try {
    const deletedDuck = await getDuckCollection().findOneAndDelete({
      name: req.params.name,
    });

    if (!deletedDuck) {
      res.status(404).json({ message: "Duck not found" });
      return;
    }

    res.status(200).json({ message: "Duck deleted", duck: deletedDuck });
  } catch (error) {
    console.error("Failed to delete duck:", error);
    res.status(500).json({ message: "Failed to delete duck" });
  }
});

app.patch("/ducks/:name", requirePassword, async (req, res) => {
  try {
    const { color, age } = req.body as Partial<Duck>;
    const updates: Partial<Omit<Duck, "name">> = {};

    if (color !== undefined) {
      if (typeof color !== "string" || color.length === 0) {
        res.status(400).json({ message: "Color must be a non-empty string" });
        return;
      }
      updates.color = color;
    }
    if (age !== undefined) {
      if (typeof age !== "number" || age < 0) {
        res.status(400).json({ message: "Age must be zero or greater" });
        return;
      }
      updates.age = age;
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: "Provide color or age to update" });
      return;
    }

    const result = await getDuckCollection().updateOne(
      { name: req.params.name },
      { $set: updates },
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Duck not found" });
      return;
    }

    const updatedDuck = await getDuckCollection().findOne({
      name: req.params.name,
    });
    res.status(200).json({ message: "Duck updated", duck: updatedDuck });
  } catch (error) {
    console.error("Failed to update duck:", error);
    res.status(500).json({ message: "Failed to update duck" });
  }
});

app.get("/ducks/color", async (req, res) => {
  const { color } = req.query;
  if (typeof color !== "string") {
    res.status(400).json({ message: "Provide a color query parameter" });
    return;
  }
  try {
    const ducks = await getDuckCollection().find({ color }).toArray();
    res.status(200).json(ducks);
  } catch (error) {
    console.error("Failed to filter ducks by color:", error);
    res.status(500).json({ message: "Failed to filter ducks by color" });
  }
});

app.get("/ducks/age", async (req, res) => {
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

  try {
    const ducks = await getDuckCollection().find({ age }).toArray();
    res.status(200).json(ducks);
  } catch (error) {
    console.error("Failed to filter ducks by age:", error);
    res.status(500).json({ message: "Failed to filter ducks by age" });
  }
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
