import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./database/schemas",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL as string,
  },
  verbose: true,
  strict: true,
});
