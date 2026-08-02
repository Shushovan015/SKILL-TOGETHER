import { Global, Module } from "@nestjs/common";

import { ApiConfigService } from "./api-config.service.js";

@Global()
@Module({
  providers: [ApiConfigService],
  exports: [ApiConfigService]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiConfigModule {}
