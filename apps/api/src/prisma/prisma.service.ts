import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { resolveApiConfig } from "../common/config/api-config.service.js";
import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  public constructor() {
    const config = resolveApiConfig();

    super({
      adapter: new PrismaPg(
        config.databaseUrl ??
          "postgresql://skilltogether:unused@localhost:5432/skilltogether_unused"
      )
    });
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
