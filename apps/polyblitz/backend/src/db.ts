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

  try {
    await client.connect();
    const connectedDb = client.db(dbName);
    await connectedDb.command({ ping: 1 });
    db = connectedDb;
    console.log("Successfully connected to MongoDB server");
    return db;
  } catch (error: unknown) {
    try {
      await client.close();
    } catch (closeError: unknown) {
      console.error(
        "Failed to close MongoDB client after connection error:",
        closeError,
      );
    }
    throw error;
  }
}
