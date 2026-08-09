import { UseGuards } from "@nestjs/common";
import { Args, Context, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthSessionGuard } from "../auth/auth-session.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { PartnerProgressSummaryDto } from "../planning/dto/planning.dto.js";
import {
  toPartnerConnectionDto,
  toPartnerDashboardDto,
  toPartnerInvitationDto,
  toPartnerProgressDto
} from "./accountability.mapper.js";
import { AccountabilityService } from "./accountability.service.js";
import {
  InvitePartnerInputDto,
  PartnerConnectionDto,
  PartnerDashboardDto,
  PartnerInvitationDto
} from "./dto/accountability.dto.js";

@Resolver()
export class AccountabilityResolver {
  public constructor(private readonly accountabilityService: AccountabilityService) {}

  @Query(() => PartnerDashboardDto)
  @UseGuards(AuthSessionGuard)
  public async partnerDashboard(
    @Context() context: GraphqlContext
  ): Promise<PartnerDashboardDto> {
    return toPartnerDashboardDto(
      await this.accountabilityService.dashboard(requireCurrentUser(context))
    );
  }

  @Query(() => [PartnerInvitationDto])
  @UseGuards(AuthSessionGuard)
  public async partnerInvitations(
    @Context() context: GraphqlContext
  ): Promise<readonly PartnerInvitationDto[]> {
    return (await this.accountabilityService.partnerInvitations(requireCurrentUser(context))).map(
      toPartnerInvitationDto
    );
  }

  @Query(() => [PartnerConnectionDto])
  @UseGuards(AuthSessionGuard)
  public async partnerConnections(
    @Context() context: GraphqlContext
  ): Promise<readonly PartnerConnectionDto[]> {
    return (await this.accountabilityService.partnerConnections(requireCurrentUser(context))).map(
      toPartnerConnectionDto
    );
  }

  @Query(() => [PartnerProgressSummaryDto])
  @UseGuards(AuthSessionGuard)
  public async partnerProgress(
    @Context() context: GraphqlContext
  ): Promise<readonly PartnerProgressSummaryDto[]> {
    return (await this.accountabilityService.partnerProgress(requireCurrentUser(context))).map(
      toPartnerProgressDto
    );
  }

  @Mutation(() => PartnerInvitationDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async invitePartner(
    @Args("input", { type: () => InvitePartnerInputDto }) input: InvitePartnerInputDto,
    @Context() context: GraphqlContext
  ): Promise<PartnerInvitationDto> {
    return toPartnerInvitationDto(
      await this.accountabilityService.invitePartner(requireCurrentUser(context), input)
    );
  }

  @Mutation(() => PartnerInvitationDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async acceptPartnerInvitation(
    @Args("invitationId", { type: () => ID }) invitationId: string,
    @Context() context: GraphqlContext
  ): Promise<PartnerInvitationDto> {
    return toPartnerInvitationDto(
      await this.accountabilityService.acceptInvitation(requireCurrentUser(context), invitationId)
    );
  }

  @Mutation(() => PartnerInvitationDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async rejectPartnerInvitation(
    @Args("invitationId", { type: () => ID }) invitationId: string,
    @Context() context: GraphqlContext
  ): Promise<PartnerInvitationDto> {
    return toPartnerInvitationDto(
      await this.accountabilityService.rejectInvitation(requireCurrentUser(context), invitationId)
    );
  }

  @Mutation(() => PartnerInvitationDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async revokePartnerInvitation(
    @Args("invitationId", { type: () => ID }) invitationId: string,
    @Context() context: GraphqlContext
  ): Promise<PartnerInvitationDto> {
    return toPartnerInvitationDto(
      await this.accountabilityService.revokeInvitation(requireCurrentUser(context), invitationId)
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async removePartnerConnection(
    @Args("connectionId", { type: () => ID }) connectionId: string,
    @Context() context: GraphqlContext
  ): Promise<boolean> {
    return this.accountabilityService.removeConnection(requireCurrentUser(context), connectionId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async blockUser(
    @Args("userId", { type: () => ID }) userId: string,
    @Context() context: GraphqlContext
  ): Promise<boolean> {
    return this.accountabilityService.blockUser(requireCurrentUser(context), userId);
  }
}

function requireCurrentUser(context: GraphqlContext) {
  if (context.currentUser === undefined) {
    throw new Error("AuthSessionGuard did not populate current user");
  }

  return context.currentUser;
}
