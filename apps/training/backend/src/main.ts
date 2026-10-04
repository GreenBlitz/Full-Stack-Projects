import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());

app.listen(3001, () => {
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

app.post("/student", (req, res) => {
  console.log(req.body);
  res.send({
    message: "Student recieved!",
    student: req.body,
  });
});
