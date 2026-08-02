import { Module } from "@nestjs/common";

import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [HealthModule]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
