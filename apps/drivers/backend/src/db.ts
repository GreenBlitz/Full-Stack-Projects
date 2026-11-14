import { MongoClient } from "mongodb";

const url = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const dbName = "scouting";

const client = new MongoClient(url);
export const db = client.db(dbName);
