import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

import { DateTimeValue } from "../../../common/graphql/date-time.scalar.js";
import { PartnerProgressSummaryDto } from "../../planning/dto/planning.dto.js";

export enum InvitationStatusDto {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED"
}

registerEnumType(InvitationStatusDto, {
  name: "InvitationStatus"
});

@InputType("InvitePartnerInput")
export class InvitePartnerInputDto {
  @Field()
  public email!: string;
}

@ObjectType("PartnerInvitation")
export class PartnerInvitationDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public inviterDisplayName!: string;

  @Field()
  public inviteeEmail!: string;

  @Field(() => InvitationStatusDto)
  public status!: InvitationStatusDto;

  @Field(() => DateTimeValue)
  public expiresAt!: Date;

  @Field(() => DateTimeValue)
  public createdAt!: Date;

  @Field()
  public direction!: string;
}

@ObjectType("PartnerConnection")
export class PartnerConnectionDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public partnerUserId!: string;

  @Field()
  public partnerDisplayName!: string;

  @Field()
  public status!: string;

  @Field(() => DateTimeValue)
  public createdAt!: Date;
}

@ObjectType("PartnerDashboard")
export class PartnerDashboardDto {
  @Field(() => [PartnerInvitationDto])
  public invitations!: readonly PartnerInvitationDto[];

  @Field(() => [PartnerConnectionDto])
  public connections!: readonly PartnerConnectionDto[];

  @Field(() => [PartnerProgressSummaryDto])
  public progress!: readonly PartnerProgressSummaryDto[];
}

export { PartnerProgressSummaryDto };
