import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { apiErrorMessages, createApiGraphqlError } from "../../common/errors/graphql-errors.js";
import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthService } from "./auth.service.js";

@Injectable()
export class AuthSessionGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext<GraphqlContext>();
    const resolvedSession = await this.authService.resolveSession(gqlContext.req);

    if (resolvedSession === null) {
      throw createApiGraphqlError({
        code: "AUTH_REQUIRED",
        message: apiErrorMessages.AUTH_REQUIRED,
        retryable: false
      });
    }

    gqlContext.currentUser = resolvedSession.user;
    gqlContext.currentSessionId = resolvedSession.session.id;
    return true;
  }
}
