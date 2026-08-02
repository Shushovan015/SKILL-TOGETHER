import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";

import { TimeValue } from "../../../common/graphql/time.scalar.js";

@ObjectType("UserProfile")
export class UserProfileDto {
  @Field()
  public displayName!: string;

  @Field()
  public timeZone!: string;

  @Field(() => TimeValue, { nullable: true })
  public preferredSessionTime!: string | null;
}

@ObjectType("User")
export class UserDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public email!: string;

  @Field(() => UserProfileDto)
  public profile!: UserProfileDto;

  @Field(() => [String])
  public roles!: readonly string[];
}

@ObjectType("AuthPayload")
export class AuthPayloadDto {
  @Field(() => UserDto)
  public user!: UserDto;
}

@InputType("RegisterInput")
export class RegisterInputDto {
  @Field()
  public email!: string;

  @Field()
  public password!: string;

  @Field()
  public displayName!: string;

  @Field()
  public timeZone!: string;
}

@InputType("LoginInput")
export class LoginInputDto {
  @Field()
  public email!: string;

  @Field()
  public password!: string;
}
