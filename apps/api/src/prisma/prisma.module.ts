import { Global, Module } from "@nestjs/common";

import { ApiConfigModule } from "../common/config/api-config.module.js";
import { PrismaService } from "./prisma.service.js";

@Global()
@Module({
  imports: [ApiConfigModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PrismaModule {}
