import { Db, MongoClient } from "mongodb";

const url =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI ??
  "mongodb://localhost:27017";
const dbName = "polyBLitzDB";

let db: Db | undefined;

export async function openDatabase(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(url);
  await client.connect();
  console.log("Successfully connected to MongoDB server");
  db = client.db(dbName);
  return db;
}
