import express from "express";

const app = express();

app.listen(3000, () => {
  console.log("Server is running!");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/school", (req, res) => {
  res.json({
    name: "Teva",
    city: "Tel Aviv",
    students: "Levi, Amit, Tammy",
  });
});
