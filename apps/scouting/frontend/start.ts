// בס"ד
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";

const app = express();

const BACKEND_URL = process.env.BACKEND_PROXY_URL ?? "http://localhost:4590";
const BACKEND_URI_PREFIX = "/api/v1";

app.use(
  BACKEND_URI_PREFIX,
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
      "^": BACKEND_URI_PREFIX,
    },
  }),
);

console.log("Backend URL: ", BACKEND_URL);

const defaultPort = 80;
const securePort = 443;
const port = parseInt(process.env.FRONTEND_PORT ?? defaultPort.toString());
const protocol = port === securePort ? "https" : "http";

const dirname = path.dirname(__filename);
const distDirectory = path.join(dirname, "dist");
const indexHTML = path.join(distDirectory, "index.html");

app.use(express.static(distDirectory));

app.get(/^(.*)$/, (req, res) => {
  res.sendFile(indexHTML);
});

app.listen(port, () => {
  console.log(`Production server running at ${protocol}://localhost:${port}`);
});
