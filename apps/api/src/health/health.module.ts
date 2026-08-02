import { Module } from "@nestjs/common";

import { ApiConfigModule } from "../common/config/api-config.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { HealthController } from "./health.controller.js";
import { HealthService } from "./health.service.js";

@Module({
  imports: [ApiConfigModule, PrismaModule],
  controllers: [HealthController],
  providers: [HealthService]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HealthModule {}
