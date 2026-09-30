import express from "express";
import axios from "axios";

const app = express();

app.listen(3001, () => {
  console.log("Server is running!");
  void getSchool();
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/school", (req, res) =>
  res.json({ name: "HaKfar Hayarok", city: "Ramat HaSharon", students: 250 }),
);

async function getSchool() {
  const response = await axios.get("http://localhost:3001/school");
  console.log(response.data);
}

