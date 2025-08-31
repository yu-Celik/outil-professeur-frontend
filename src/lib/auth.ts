import path from "node:path";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";

const dbPath =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "sqlite.db")
    : path.join(process.cwd(), "sqlite.db");

const database = new Database(dbPath, {
  verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
});

// Enable WAL mode for better concurrent access
database.pragma("journal_mode = WAL");
database.pragma("synchronous = NORMAL");

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // On désactive pour l'instant
  },
  user: {
    additionalFields: {
      subjects: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [nextCookies()],
  telemetry: {
    enabled: false,
  },
});
