import { Scalar, type CustomScalar } from "@nestjs/graphql";
import { GraphQLError, Kind, type ValueNode } from "graphql";

export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  readonly [key: string]: JsonValue;
}
export type JsonArray = readonly JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export class GraphqlJsonValue {
  private readonly brand = "JSON";
}

@Scalar("JSON", () => GraphqlJsonValue)
export class JsonScalar implements CustomScalar<unknown, JsonValue> {
  public readonly description = "JSON value.";

  public parseValue(value: unknown): JsonValue {
    return toJsonValue(value);
  }

  public serialize(value: unknown): JsonValue {
    return toJsonValue(value);
  }

  public parseLiteral(ast: ValueNode): JsonValue {
    return literalToJson(ast);
  }
}

function literalToJson(ast: ValueNode): JsonValue {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.ENUM:
      return ast.value;
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.NULL:
      return null;
    case Kind.LIST:
      return ast.values.map(literalToJson);
    case Kind.OBJECT:
      return Object.fromEntries(ast.fields.map((field) => [field.name.value, literalToJson(field.value)]));
    case Kind.VARIABLE:
      throw new GraphQLError("JSON variables must be supplied as values.");
  }
}

function toJsonValue(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, toJsonValue(nestedValue)])
    );
  }

  throw new GraphQLError("Value is not valid JSON.");
}
