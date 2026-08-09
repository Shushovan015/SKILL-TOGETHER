import { Module } from "@nestjs/common";

import { ApiConfigService } from "../../common/config/api-config.service.js";
import { TimeScalar } from "../../common/graphql/time.scalar.js";
import { OwnershipGuardFoundation } from "../../common/guards/ownership.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthResolver } from "./auth.resolver.js";
import { AuthService } from "./auth.service.js";
import { AuthSessionGuard } from "./auth-session.guard.js";
import { CsrfGuard } from "./csrf.guard.js";
import { AuthRateLimitService } from "./domain/auth-rate-limit.service.js";
import { CsrfService } from "./domain/csrf.service.js";
import { PasswordService } from "./domain/password.service.js";
import { SessionTokenService } from "./domain/session-token.service.js";
import { AUTH_REPOSITORY, type AuthRepository } from "./persistence/auth.repository.js";
import { InMemoryAuthRepository } from "./persistence/in-memory-auth.repository.js";
import { PrismaAuthRepository } from "./persistence/prisma-auth.repository.js";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    AuthSessionGuard,
    CsrfGuard,
    PasswordService,
    SessionTokenService,
    CsrfService,
    AuthRateLimitService,
    TimeScalar,
    RolesGuard,
    OwnershipGuardFoundation,
    {
      provide: AUTH_REPOSITORY,
      inject: [ApiConfigService, PrismaService],
      useFactory: (
        configService: ApiConfigService,
        prismaService: PrismaService
      ): AuthRepository => {
        if (configService.value.authPersistence === "memory") {
          return new InMemoryAuthRepository();
        }

        return new PrismaAuthRepository(prismaService);
      }
    }
  ],
  exports: [
    AuthService,
    AuthSessionGuard,
    CsrfGuard,
    CsrfService,
    RolesGuard,
    OwnershipGuardFoundation
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthModule {}
