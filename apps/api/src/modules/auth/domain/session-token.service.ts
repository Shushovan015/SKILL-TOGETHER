import { createHmac, randomBytes } from "node:crypto";

import { Injectable } from "@nestjs/common";
import type { Response } from "express";

import { ApiConfigService } from "../../../common/config/api-config.service.js";
import type { CookieRequest } from "../../../common/graphql/graphql-context.js";

@Injectable()
export class SessionTokenService {
  public constructor(private readonly configService: ApiConfigService) {}

  public createRawToken(): string {
    return randomBytes(32).toString("base64url");
  }

  public hashToken(rawToken: string): string {
    return createHmac("sha256", this.configService.value.sessionSecret)
      .update(rawToken)
      .digest("base64url");
  }

  public readRawToken(request: CookieRequest): string | undefined {
    const token = request.cookies?.[this.configService.value.sessionCookieName];
    return token === undefined || token.trim().length === 0 ? undefined : token;
  }

  public writeSessionCookie(response: Response, rawToken: string, expiresAt: Date): void {
    response.cookie(this.configService.value.sessionCookieName, rawToken, {
      httpOnly: true,
      secure: this.configService.value.sessionCookieSecure,
      sameSite: this.configService.value.sessionCookieSameSite,
      expires: expiresAt,
      path: "/"
    });
  }

  public clearSessionCookie(response: Response): void {
    response.clearCookie(this.configService.value.sessionCookieName, {
      httpOnly: true,
      secure: this.configService.value.sessionCookieSecure,
      sameSite: this.configService.value.sessionCookieSameSite,
      path: "/"
    });
  }
}
