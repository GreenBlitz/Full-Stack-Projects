import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.listen(4590, () => {
  console.log("Server is running!");
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/ducks", (req, res) => {
  res.send("abcdefg");
});

interface Duck {
  name: string;
  color: string;
  age: number;
}
