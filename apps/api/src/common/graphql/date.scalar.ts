import { Scalar, type CustomScalar } from "@nestjs/graphql";
import { GraphQLError, Kind, type ValueNode } from "graphql";

export class DateValue {
  private readonly brand = "Date";
}

@Scalar("Date", () => DateValue)
export class DateScalar implements CustomScalar<string, Date> {
  public readonly description = "Date-only value serialized as YYYY-MM-DD.";

  public parseValue(value: unknown): Date {
    if (typeof value !== "string") {
      throw new GraphQLError("Date must be a string.");
    }

    return parseDateOnly(value);
  }

  public serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new GraphQLError("Date must be a Date instance.");
    }

    return value.toISOString().slice(0, 10);
  }

  public parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("Date must be a string.");
    }

    return parseDateOnly(ast.value);
  }
}

export function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    throw new GraphQLError("Date must use YYYY-MM-DD format.");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new GraphQLError("Date must be a real calendar date.");
  }

  return date;
}
