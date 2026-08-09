import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { config as loadEnvironment } from "dotenv";

import { AppModule } from "./app.module.js";

loadEnvironment({
  path: [".env", "../../.env"]
});

process.env["SEED_ON_STARTUP"] = "true";

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"]
  });

  await app.close();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
