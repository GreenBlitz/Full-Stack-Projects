import express from "express";
import { useEffect, useState } from "react";
import { Duck } from "../../frontend/src/DuckCard";
import { data } from "react-router-dom";
const app = express();
app.use(express.json());
interface duck {
  name: string;
  color: string;
  age: number;
}
const Ducks: duck[] = [
  { name: "Yoni", color: "red", age: 12 },
  { name: "donatt", color: "red", age: 12 },
  { name: "ulalek", color: "white", age: 12 },
  { name: "raz<3", color: "yellow", age: 15 },
];
app.get("/", (req, res) => {
  res.send("welcome!!");
});
app.get("/ducks", (req, res) => {
  res.json(Ducks);
});
app.get("/ducks/:name", (req, res) => {
  const duckName = req.params.name;
  const duck = Ducks.find((item) => item.name === duckName);
  if (!duck) {
    return res.status(404).send("Duck not found");
  }
  res.json(duck);
});
app.post("/ducks", (req, res) => {
  const newDuck: duck = req.body;
  Ducks.push(newDuck);
  res.status(201).json(newDuck);
});
app.delete("/ducks/:name", (req, res) => {
  const duckName = req.params.name;
  const duckIndex = Ducks.findIndex((item) => item.name === duckName);
  if (duckIndex === -1) {
    return res.status(404).send("Duck not found");
  }
  const [deletedDuck] = Ducks.splice(duckIndex, 1);
  res.json(deletedDuck);
});
app.patch("/ducks/:name", (req, res) => {
  const nameOfDuck = req.params.name;
  const duck = Ducks.find((item) => item.name === nameOfDuck);
  if (!duck) {
    return res.status(404).send("Duck not found");
  }
  Object.assign(duck, req.body);
  res.json(duck);
});
app.get("/ducks", (req, res) => {
  const color =
    typeof req.query.color === "string" ? req.query.color.trim() : "";
  const filteredDucks = color
    ? Ducks.filter((duck) => duck.color.trim() === color)
    : Ducks;
  res.json(filteredDucks);
});
app.use((req, res, next) => {
  console.log("time:", Date.now());
  next();
});

app.listen(3000, () => {
  console.log("Server is running!");
});
