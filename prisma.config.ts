import { defineConfig } from "prisma/config";

const defaultDatabaseUrl =
  "postgresql://skilltogether:skilltogether_dev_password@localhost:5432/skilltogether_dev";
const databaseUrl = process.env["DATABASE_URL"];

if (process.env["NODE_ENV"] === "production" && (databaseUrl === undefined || databaseUrl.trim().length === 0)) {
  throw new Error("DATABASE_URL is required for production Prisma commands");
}

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    path: "apps/api/prisma/migrations"
  },
  datasource: {
    url: databaseUrl ?? defaultDatabaseUrl
  }
});
