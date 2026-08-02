import { Inject, Injectable } from "@nestjs/common";

import { ApiConfigService } from "../../common/config/api-config.service.js";
import { apiErrorMessages, createApiGraphqlError } from "../../common/errors/graphql-errors.js";
import type { CookieRequest, GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthRateLimitService } from "./domain/auth-rate-limit.service.js";
import type { AuthenticatedUser, PublicUser, SessionRecord } from "./domain/auth.types.js";
import { PasswordService } from "./domain/password.service.js";
import { SessionTokenService } from "./domain/session-token.service.js";
import {
  validateLoginInput,
  validateRegisterInput
} from "./domain/auth.validation.js";
import {
  AUTH_REPOSITORY,
  type AuthRepository,
  DuplicateEmailError
} from "./persistence/auth.repository.js";

export interface ResolvedSession {
  readonly user: AuthenticatedUser;
  readonly session: SessionRecord;
}

@Injectable()
export class AuthService {
  public constructor(
    @Inject(AUTH_REPOSITORY) private readonly repository: AuthRepository,
    private readonly configService: ApiConfigService,
    private readonly passwordService: PasswordService,
    private readonly sessionTokenService: SessionTokenService,
    private readonly rateLimitService: AuthRateLimitService
  ) {}

  public async register(input: unknown, context: GraphqlContext): Promise<PublicUser> {
    const validated = validateRegisterInput(input);
    const rawSessionToken = this.sessionTokenService.createRawToken();
    const sessionExpiresAt = this.createSessionExpiry();
    const passwordHash = await this.passwordService.hashPassword(validated.password);

    try {
      const user = await this.repository.createUserWithSession({
        email: validated.email,
        passwordHash,
        displayName: validated.displayName,
        timeZone: validated.timeZone,
        sessionHash: this.sessionTokenService.hashToken(rawSessionToken),
        sessionExpiresAt
      });

      this.sessionTokenService.writeSessionCookie(context.res, rawSessionToken, sessionExpiresAt);
      return toPublicUser(user);
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        throw createApiGraphqlError({
          code: "VALIDATION_FAILED",
          message: apiErrorMessages.VALIDATION_FAILED,
          retryable: false,
          field: "email"
        });
      }

      throw error;
    }
  }

  public async login(input: unknown, context: GraphqlContext): Promise<PublicUser> {
    const validated = validateLoginInput(input);
    this.rateLimitService.assertLoginAllowed(context.req, validated.email);

    const user = await this.repository.findUserByEmail(validated.email);

    if (
      user === null ||
      user.status !== "ACTIVE" ||
      !(await this.passwordService.verifyPassword(user.passwordHash, validated.password))
    ) {
      this.rateLimitService.recordFailedLogin(context.req, validated.email);
      throw createApiGraphqlError({
        code: "AUTH_INVALID_CREDENTIALS",
        message: apiErrorMessages.AUTH_INVALID_CREDENTIALS,
        retryable: false
      });
    }

    await this.revokeExistingCookieSession(context.req);
    const rawSessionToken = this.sessionTokenService.createRawToken();
    const sessionExpiresAt = this.createSessionExpiry();

    await this.repository.createSession({
      userId: user.id,
      sessionHash: this.sessionTokenService.hashToken(rawSessionToken),
      expiresAt: sessionExpiresAt
    });

    this.rateLimitService.reset(context.req, validated.email);
    this.sessionTokenService.writeSessionCookie(context.res, rawSessionToken, sessionExpiresAt);

    return toPublicUser(user);
  }

  public async logout(context: GraphqlContext): Promise<boolean> {
    const rawSessionToken = this.sessionTokenService.readRawToken(context.req);

    if (rawSessionToken !== undefined) {
      await this.repository.revokeSessionByHash(
        this.sessionTokenService.hashToken(rawSessionToken),
        new Date()
      );
    }

    this.sessionTokenService.clearSessionCookie(context.res);
    return true;
  }

  public async resolveSession(request: CookieRequest): Promise<ResolvedSession | null> {
    const rawSessionToken = this.sessionTokenService.readRawToken(request);

    if (rawSessionToken === undefined) {
      return null;
    }

    const session = await this.repository.findActiveSessionByHash(
      this.sessionTokenService.hashToken(rawSessionToken),
      new Date()
    );

    if (session === null) {
      return null;
    }

    const user = await this.repository.findUserById(session.userId);

    if (user === null || user.status !== "ACTIVE") {
      await this.repository.revokeSessionById(session.id, new Date());
      return null;
    }

    return {
      user,
      session
    };
  }

  private createSessionExpiry(): Date {
    return new Date(Date.now() + this.configService.value.sessionTtlMs);
  }

  private async revokeExistingCookieSession(request: CookieRequest): Promise<void> {
    const rawSessionToken = this.sessionTokenService.readRawToken(request);

    if (rawSessionToken !== undefined) {
      await this.repository.revokeSessionByHash(
        this.sessionTokenService.hashToken(rawSessionToken),
        new Date()
      );
    }
  }
}

export function toPublicUser(user: AuthenticatedUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    profile: user.profile,
    roles: user.roles
  };
}
