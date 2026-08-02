import { Catch } from "@nestjs/common";
import { type GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch(GraphQLError)
export class GraphqlErrorFilter implements GqlExceptionFilter {
  public catch(exception: GraphQLError): GraphQLError {
    return exception;
  }
}
