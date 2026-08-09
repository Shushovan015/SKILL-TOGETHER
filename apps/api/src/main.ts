import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { config as loadEnvironment } from "dotenv";

import { AppModule } from "./app.module.js";
import { ApiConfigService } from "./common/config/api-config.service.js";
import { configureApplication } from "./configure-app.js";

loadEnvironment({
  path: [".env", "../../.env"]
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.listen(app.get(ApiConfigService).value.apiPort);
}

void bootstrap();
