import { Scalar, type CustomScalar } from "@nestjs/graphql";
import { GraphQLError, Kind, type ValueNode } from "graphql";

export class DateTimeValue {
  private readonly brand = "DateTime";
}

@Scalar("DateTime", () => DateTimeValue)
export class DateTimeScalar implements CustomScalar<string, Date> {
  public readonly description = "Date-time value serialized as an ISO-8601 string.";

  public parseValue(value: unknown): Date {
    if (typeof value !== "string") {
      throw new GraphQLError("DateTime must be a string.");
    }

    return parseDateTime(value);
  }

  public serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new GraphQLError("DateTime must be a Date instance.");
    }

    return value.toISOString();
  }

  public parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("DateTime must be a string.");
    }

    return parseDateTime(ast.value);
  }
}

function parseDateTime(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError("DateTime must be a valid ISO-8601 value.");
  }

  return date;
}
