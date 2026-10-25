// const defaultPort = 4590;
// const port = process.env.BACKEND_PORT ?? defaultPort;
// app.listen(port, () => {
//   console.log(`Production server running at http://localhost:${port}`);
// });
import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});
app.get("/school", (req, res) => {
  res.json({
    name: "Karni",
    city: "Tel Aviv",
    students: ["Amit", "Noam"],
  });
  app.use(express.json());

  app.post("/students", (req, res) => {
    console.log(req.body);

    res.send("Student received!");
  });
});
app.listen(3000, () => {
  console.log("Server is running!");
});
