import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing");

const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  console.log("MongoDB Connected ✔️");

  const dbName = uri.split("/").pop() || "telegram-bot";
  return client.db(dbName);
}

export function getClient() {
  return client;
}
