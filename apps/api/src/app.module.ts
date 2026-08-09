import { Module } from "@nestjs/common";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { ApiConfigModule } from "./common/config/api-config.module.js";
import { ApiConfigService } from "./common/config/api-config.service.js";
import { GraphqlErrorFilter } from "./common/errors/graphql-error.filter.js";
import { DateTimeScalar } from "./common/graphql/date-time.scalar.js";
import { DateScalar } from "./common/graphql/date.scalar.js";
import { JsonScalar } from "./common/graphql/json.scalar.js";
import { HealthModule } from "./health/health.module.js";
import { AccountabilityModule } from "./modules/accountability/accountability.module.js";
import { AssessmentModule } from "./modules/assessment/assessment.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ContentModule } from "./modules/content/content.module.js";
import { PlanningModule } from "./modules/planning/planning.module.js";
import type {
  GraphqlContext,
  GraphqlContextFactoryArgs
} from "./common/graphql/graphql-context.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
  imports: [
    ApiConfigModule,
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService): ApolloDriverConfig => ({
        autoSchemaFile: true,
        context: ({ req, res }: GraphqlContextFactoryArgs): GraphqlContext => ({
          req,
          res
        }),
        introspection: configService.value.nodeEnv !== "production",
        path: "/graphql",
        sortSchema: true
      })
    }),
    HealthModule,
    AuthModule,
    ContentModule,
    PlanningModule,
    AssessmentModule,
    AccountabilityModule
  ],
  providers: [
    DateScalar,
    DateTimeScalar,
    JsonScalar,
    {
      provide: APP_FILTER,
      useClass: GraphqlErrorFilter
    }
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
