import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { validateSecret } from "../security/validateEnv.js";

const uri: string = validateSecret(process.env.DB_CONNECTION_STRING);
const dbName: string = validateSecret(process.env.DB_NAME);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;


export async function runDB(): Promise<void> {
  if (isConnected) return;
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    isConnected = true;
    console.log("DB is up and running");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function getDB(): Db {
  if (!isConnected) {
    throw new Error(" Tried to access DB before connecting");
  }
  return client.db(dbName);
}

export async function closeDB(): Promise<void> {
  await client.close();
  isConnected = false;
  console.log("MongoDB connection closed");
}
