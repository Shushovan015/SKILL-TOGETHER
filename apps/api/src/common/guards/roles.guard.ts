import { type CanActivate, type ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";

import type { AuthRole } from "../../modules/auth/domain/auth.types.js";
import { apiErrorMessages, createApiGraphqlError } from "../errors/graphql-errors.js";
import type { GraphqlContext } from "../graphql/graphql-context.js";

const rolesMetadataKey = "skilltogether:roles";

export function RequireRoles(...roles: readonly AuthRole[]): MethodDecorator {
  return SetMetadata(rolesMetadataKey, roles);
}

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<readonly AuthRole[]>(rolesMetadataKey, [
        context.getHandler(),
        context.getClass()
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext<GraphqlContext>();

    if (gqlContext.currentUser === undefined) {
      throw createApiGraphqlError({
        code: "AUTH_REQUIRED",
        message: apiErrorMessages.AUTH_REQUIRED,
        retryable: false
      });
    }

    const authorized = requiredRoles.some((role) => gqlContext.currentUser?.roles.includes(role));

    if (!authorized) {
      throw createApiGraphqlError({
        code: "AUTH_FORBIDDEN",
        message: apiErrorMessages.AUTH_FORBIDDEN,
        retryable: false
      });
    }

    return true;
  }
}
