import express from "express";
import helmet from "helmet";
import cors from "cors";
import { some } from "fp-ts/lib/OptionT";

const app = express();
const students: string[] = [];

app.use(cors());
app.use(express.json());
app.use(helmet());

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

app.post("/students", (req, res) => {
  const somethinIdk = req.body;
  console.log(somethinIdk);
  res.json({
    message: "Student Received",
    student: { name: somethinIdk, grade: 10 },
  });
});
