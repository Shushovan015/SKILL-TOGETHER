import type { Request, Response } from "express";

import type { AuthenticatedUser } from "../../modules/auth/domain/auth.types.js";

export interface CookieRequest extends Request {
  readonly cookies: Record<string, string | undefined>;
}

export interface GraphqlContext {
  readonly req: CookieRequest;
  readonly res: Response;
  currentUser?: AuthenticatedUser;
  currentSessionId?: string;
}

export interface GraphqlContextFactoryArgs {
  readonly req: CookieRequest;
  readonly res: Response;
}
