import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { CsrfService } from "./domain/csrf.service.js";

@Injectable()
export class CsrfGuard implements CanActivate {
  public constructor(private readonly csrfService: CsrfService) {}

  public canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context).getContext<GraphqlContext>();
    this.csrfService.assertValidRequest(gqlContext.req);
    return true;
  }
}
