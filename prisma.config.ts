import { defineConfig } from "prisma/config";

const defaultDatabaseUrl =
  "postgresql://skilltogether:skilltogether_dev_password@localhost:5432/skilltogether_dev";

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    path: "apps/api/prisma/migrations"
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? defaultDatabaseUrl
  }
});
