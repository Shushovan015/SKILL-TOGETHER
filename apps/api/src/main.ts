import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

function resolvePort(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "4000", 10);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new Error("API_PORT must be an integer between 1 and 65535");
  }

  return parsed;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(resolvePort(process.env["API_PORT"]));
}

void bootstrap();
