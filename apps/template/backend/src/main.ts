const Arr: string[] = [];
import express from "express";
import { StatusCodes } from "http-status-codes";
const app = express();
app.get("/name", (req, res) => {
  res.status(StatusCodes.OK).send(Arr);
});
app.post("/add/:name", (req, res) => {
  Arr.push(req.params.name);
  res.status(StatusCodes.OK).send(Arr);
});

const port = 2220;
app.listen(port);
