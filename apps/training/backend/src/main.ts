// בס"ד

import express from "express";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use((req, res, next) => {
  const origin = req.headers.origin ?? "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/student", (req, res) => {
  res.json({
    Name: "Alice",
    Grade: 10,
    school: "zib academy",
    IsZib: false,
  });
});

app.post("/students", (req, res) => {
  console.log(req.body);

  res.send("Student received!");
});

app.use(express.json());

async function createStudent(): Promise<void> {
  return;
}

app.get("/school", (req, res) => {
  res.json({ message: "School endpoint is available" });
});

app.post("/student", (req, res) => {
  console.log("POST /student", req.body);
  res.status(200).json({ ok: true, received: req.body });
});

app.post("/ducks", (req, res) => {
  console.log("POST /ducks", req.body);
  res.status(200).json({ ok: true, received: req.body });
});

app.listen(port, () => {
  console.log("Server is running!");
});
