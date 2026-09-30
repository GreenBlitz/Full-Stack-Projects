import express from "express";

const app = express();

app.listen(3001, () => {
  console.log("Server is running!");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/school", (req, res) =>
  res.json({ name: "HaKfar Hayarok", city: "Ramat HaSharon", students: 250 }),
);
