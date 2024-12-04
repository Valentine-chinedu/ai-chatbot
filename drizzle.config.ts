import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./lib/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
