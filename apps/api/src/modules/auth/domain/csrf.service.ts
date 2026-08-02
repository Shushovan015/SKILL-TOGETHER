import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { Injectable } from "@nestjs/common";
import type { Response } from "express";

import { ApiConfigService } from "../../../common/config/api-config.service.js";
import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type { CookieRequest } from "../../../common/graphql/graphql-context.js";

@Injectable()
export class CsrfService {
  public constructor(private readonly configService: ApiConfigService) {}

  public issueToken(response: Response): string {
    const nonce = randomBytes(32).toString("base64url");
    const token = `${nonce}.${this.sign(nonce)}`;

    response.cookie(this.configService.value.csrfCookieName, token, {
      httpOnly: false,
      secure: this.configService.value.sessionCookieSecure,
      sameSite: this.configService.value.sessionCookieSameSite,
      maxAge: this.configService.value.sessionTtlMs,
      path: "/"
    });

    return token;
  }

  public assertValidRequest(request: CookieRequest): void {
    const cookieToken = request.cookies?.[this.configService.value.csrfCookieName];
    const headerValue = request.headers[this.configService.value.csrfHeaderName];
    const headerToken = Array.isArray(headerValue) ? undefined : headerValue;

    if (
      cookieToken === undefined ||
      headerToken === undefined ||
      !this.safeEqual(cookieToken, headerToken) ||
      !this.verifyToken(headerToken)
    ) {
      throw createApiGraphqlError({
        code: "CSRF_INVALID",
        message: apiErrorMessages.CSRF_INVALID,
        retryable: true
      });
    }
  }

  private sign(value: string): string {
    return createHmac("sha256", this.configService.value.csrfSecret)
      .update(value)
      .digest("base64url");
  }

  private verifyToken(token: string): boolean {
    const [nonce, signature, extra] = token.split(".");

    if (nonce === undefined || signature === undefined || extra !== undefined) {
      return false;
    }

    return this.safeEqual(this.sign(nonce), signature);
  }

  private safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  }
}
