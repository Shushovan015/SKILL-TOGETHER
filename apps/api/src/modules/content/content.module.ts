import { Module } from "@nestjs/common";

import { ApiConfigService } from "../../common/config/api-config.service.js";
import { DateScalar } from "../../common/graphql/date.scalar.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { ContentResolver } from "./content.resolver.js";
import { ContentService } from "./content.service.js";
import { CONTENT_REPOSITORY, type ContentRepository } from "./persistence/content.repository.js";
import { InMemoryContentRepository } from "./persistence/in-memory-content.repository.js";
import { PrismaContentRepository } from "./persistence/prisma-content.repository.js";

@Module({
  imports: [AuthModule],
  providers: [
    ContentResolver,
    ContentService,
    DateScalar,
    {
      provide: CONTENT_REPOSITORY,
      inject: [ApiConfigService, PrismaService],
      useFactory: (
        configService: ApiConfigService,
        prismaService: PrismaService
      ): ContentRepository => {
        if (configService.value.contentPersistence === "memory") {
          return new InMemoryContentRepository();
        }

        return new PrismaContentRepository(prismaService);
      }
    }
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ContentModule {}
