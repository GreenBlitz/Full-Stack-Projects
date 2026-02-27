// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import fs from "fs";
import https from "https";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.set("query parser", "extended");
app.use(express.json());
app.use("/api/v1", apiRouter);


const options = {
  key: fs.readFileSync("./cert-key.key"),
  cert: fs.readFileSync("./certificate.crt"),
};
https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
