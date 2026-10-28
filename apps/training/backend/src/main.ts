// const defaultPort = 4590;
// const port = process.env.BACKEND_PORT ?? defaultPort;
// app.listen(port, () => {
//   console.log(`Production server running at http://localhost:${port}`);
// });
import express from "express";
const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/school", (req, res) => {
  res.json({
    name: "Karni",
    city: "Tel Aviv",
    students: ["Amit", "Noam"],
  });
});

app.get("/student", (req, res) => {
  res.json("Ori");
});

app.post("/students", (req, res) => {
  console.log(req.body);

  res.json(req.body);
});

app.listen(3000, () => {
  console.log("Server is running!");
});
