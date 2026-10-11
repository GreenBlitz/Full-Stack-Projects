import express from "express";
import helmet from "helmet";
import cors from "cors";
import { some } from "fp-ts/lib/OptionT";

const app = express();
const students: string[] = [];

app.use(cors());
app.use(express.json());
app.use(helmet());

