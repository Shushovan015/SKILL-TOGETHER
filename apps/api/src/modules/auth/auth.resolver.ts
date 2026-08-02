import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthService, toPublicUser } from "./auth.service.js";
import { AuthSessionGuard } from "./auth-session.guard.js";
import { CsrfGuard } from "./csrf.guard.js";
import { CsrfService } from "./domain/csrf.service.js";
import type { PublicUser } from "./domain/auth.types.js";
import { AuthPayloadDto, LoginInputDto, RegisterInputDto, UserDto } from "./dto/auth.dto.js";

@Resolver()
export class AuthResolver {
  public constructor(
    private readonly authService: AuthService,
    private readonly csrfService: CsrfService
  ) {}

  @Query(() => String)
  public csrfToken(@Context() context: GraphqlContext): string {
    return this.csrfService.issueToken(context.res);
  }

  @Mutation(() => AuthPayloadDto)
  @UseGuards(CsrfGuard)
  public async register(
    @Args("input", { type: () => RegisterInputDto }) input: RegisterInputDto,
    @Context() context: GraphqlContext
  ): Promise<AuthPayloadDto> {
    return {
      user: toUserDto(await this.authService.register(input, context))
    };
  }

  @Mutation(() => AuthPayloadDto)
  @UseGuards(CsrfGuard)
  public async login(
    @Args("input", { type: () => LoginInputDto }) input: LoginInputDto,
    @Context() context: GraphqlContext
  ): Promise<AuthPayloadDto> {
    return {
      user: toUserDto(await this.authService.login(input, context))
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(CsrfGuard)
  public async logout(@Context() context: GraphqlContext): Promise<boolean> {
    return this.authService.logout(context);
  }

  @Query(() => UserDto)
  @UseGuards(AuthSessionGuard)
  public me(@Context() context: GraphqlContext): UserDto {
    if (context.currentUser === undefined) {
      throw new Error("AuthSessionGuard did not populate current user");
    }

    return toUserDto(toPublicUser(context.currentUser));
  }
}

function toUserDto(user: PublicUser): UserDto {
  return {
    id: user.id,
    email: user.email,
    profile: {
      displayName: user.profile.displayName,
      timeZone: user.profile.timeZone,
      preferredSessionTime: user.profile.preferredSessionTime
    },
    roles: [...user.roles]
  };
}
