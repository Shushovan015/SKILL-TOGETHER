import { Module } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { AccountabilityResolver } from "./accountability.resolver.js";
import { AccountabilityService } from "./accountability.service.js";
import { InvitationTokenService } from "./domain/invitation-token.service.js";
import { PartnerVisibilityService } from "./domain/partner-visibility.service.js";
import {
  ACCOUNTABILITY_REPOSITORY,
  type AccountabilityRepository
} from "./persistence/accountability.repository.js";
import { PrismaAccountabilityRepository } from "./persistence/prisma-accountability.repository.js";

@Module({
  imports: [AuthModule],
  providers: [
    AccountabilityResolver,
    AccountabilityService,
    InvitationTokenService,
    PartnerVisibilityService,
    {
      provide: ACCOUNTABILITY_REPOSITORY,
      inject: [PrismaService, InvitationTokenService, PartnerVisibilityService],
      useFactory: (
        prismaService: PrismaService,
        tokenService: InvitationTokenService,
        visibilityService: PartnerVisibilityService
      ): AccountabilityRepository =>
        new PrismaAccountabilityRepository(prismaService, tokenService, visibilityService)
    }
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AccountabilityModule {}
