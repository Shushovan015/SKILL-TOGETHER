import { createHmac, randomBytes } from "node:crypto";

import { Injectable } from "@nestjs/common";

import { ApiConfigService } from "../../../common/config/api-config.service.js";

@Injectable()
export class InvitationTokenService {
  public constructor(private readonly configService: ApiConfigService) {}

  public createRawToken(): string {
    return randomBytes(32).toString("base64url");
  }

  public hashToken(rawToken: string): string {
    return createHmac("sha256", this.configService.value.sessionSecret)
      .update(rawToken)
      .digest("base64url");
  }
}
