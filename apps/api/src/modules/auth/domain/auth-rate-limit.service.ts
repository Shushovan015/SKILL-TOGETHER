import { Injectable } from "@nestjs/common";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type { CookieRequest } from "../../../common/graphql/graphql-context.js";

interface AttemptBucket {
  readonly firstAttemptAt: number;
  readonly failures: number;
}

const loginWindowMs = 15 * 60 * 1000;
const maximumLoginFailures = 5;

@Injectable()
export class AuthRateLimitService {
  private readonly attempts = new Map<string, AttemptBucket>();

  public assertLoginAllowed(request: CookieRequest, email: string): void {
    const key = this.key(request, email);
    const bucket = this.attempts.get(key);
    const now = Date.now();

    if (bucket === undefined) {
      return;
    }

    if (now - bucket.firstAttemptAt >= loginWindowMs) {
      this.attempts.delete(key);
      return;
    }

    if (bucket.failures >= maximumLoginFailures) {
      throw createApiGraphqlError({
        code: "AUTH_RATE_LIMITED",
        message: apiErrorMessages.AUTH_RATE_LIMITED,
        retryable: true
      });
    }
  }

  public recordFailedLogin(request: CookieRequest, email: string): void {
    const key = this.key(request, email);
    const now = Date.now();
    const current = this.attempts.get(key);

    if (current === undefined || now - current.firstAttemptAt >= loginWindowMs) {
      this.attempts.set(key, {
        firstAttemptAt: now,
        failures: 1
      });
      return;
    }

    this.attempts.set(key, {
      firstAttemptAt: current.firstAttemptAt,
      failures: current.failures + 1
    });
  }

  public reset(request: CookieRequest, email: string): void {
    this.attempts.delete(this.key(request, email));
  }

  private key(request: CookieRequest, email: string): string {
    const forwardedFor = request.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const ip = forwardedIp?.split(",")[0]?.trim() ?? request.ip ?? "unknown";
    return `${ip}:${email}`;
  }
}
