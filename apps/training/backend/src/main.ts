import express from "express";
import axios from "axios";

const app = express();
const students: string[] = [];

app.listen(3001, () => {
  console.log("Server is running!");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/school", (req, res) =>
  res.json({
    name: "HaKfar Hayarok",
    city: "Ramat HaSharon",
    students: students,
  }),
);

async function getSchool() {
  const response = await axios.get("http://localhost:3001/school");
  console.log(response.data);
}

app.use(express.json());

app.get("/students", (req, res) => {
  console.log(req.body);
  res.send(`Student ${req.body} received!`);
});
