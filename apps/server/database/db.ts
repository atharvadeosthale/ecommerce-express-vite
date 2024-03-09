import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

export const connectToDb = async () => {
  const connection = await client.connect();
  console.log("Connected to database");
};

export const db = drizzle(client);
