import { Scalar, type CustomScalar } from "@nestjs/graphql";
import { GraphQLError, Kind, type ValueNode } from "graphql";

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/u;

export class TimeValue {
  private readonly brand = "Time";
}

@Scalar("Time", () => TimeValue)
export class TimeScalar implements CustomScalar<string, string> {
  public readonly description = "A local time in HH:mm or HH:mm:ss format.";

  public parseValue(value: unknown): string {
    return parseTime(value);
  }

  public serialize(value: unknown): string | null {
    if (value === null) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString().slice(11, 19);
    }

    return parseTime(value);
  }

  public parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("Time must be a string.");
    }

    return parseTime(ast.value);
  }
}

function parseTime(value: unknown): string {
  if (typeof value !== "string" || !timePattern.test(value)) {
    throw new GraphQLError("Time must use HH:mm or HH:mm:ss format.");
  }

  return value;
}
