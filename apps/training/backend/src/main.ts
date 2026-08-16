// בס"ד
import express from "express";
import { apiRouter } from "./routes";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});



function greet ( name: string): string {
    return `Hello, ${name}! Welcome to the training session.`;
}
console.log(greet("joe"));