import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { resolveApiConfig } from "../common/config/api-config.service.js";
import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  public constructor() {
    const config = resolveApiConfig();

    if (config.databaseUrl === undefined) {
      throw new Error("DATABASE_URL is required when Prisma persistence is enabled");
    }

    super({
      adapter: new PrismaPg(config.databaseUrl)
    });
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
