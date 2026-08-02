import { Injectable } from "@nestjs/common";

import type { AuthenticatedUser } from "../../modules/auth/domain/auth.types.js";
import { apiErrorMessages, createApiGraphqlError } from "../errors/graphql-errors.js";

@Injectable()
export class OwnershipGuardFoundation {
  public assertUserOwnsResource(currentUser: AuthenticatedUser, ownerUserId: string): void {
    if (currentUser.id !== ownerUserId) {
      throw createApiGraphqlError({
        code: "AUTH_FORBIDDEN",
        message: apiErrorMessages.AUTH_FORBIDDEN,
        retryable: false
      });
    }
  }
}
