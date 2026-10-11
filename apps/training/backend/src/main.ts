import express from "express";
import helmet from "helmet";
import cors from "cors";
import { some } from "fp-ts/lib/OptionT";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.listen(3001, () => {
  console.log("Server is running!");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/ducks", (req, res) => {
  res.send("No ducks yet")
})