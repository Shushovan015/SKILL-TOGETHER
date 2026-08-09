import { Module } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { ContentModule } from "../content/content.module.js";
import { AssessmentEligibilityService } from "./domain/eligibility.service.js";
import { AssessmentScoringService } from "./domain/scoring.service.js";
import { WeakTopicService } from "./domain/weak-topic.service.js";
import { ASSESSMENT_REPOSITORY, type AssessmentRepository } from "./persistence/assessment.repository.js";
import { PrismaAssessmentRepository } from "./persistence/prisma-assessment.repository.js";
import { AssessmentResolver } from "./assessment.resolver.js";
import { AssessmentService } from "./assessment.service.js";

@Module({
  imports: [AuthModule, ContentModule],
  providers: [
    AssessmentResolver,
    AssessmentService,
    AssessmentEligibilityService,
    AssessmentScoringService,
    WeakTopicService,
    {
      provide: ASSESSMENT_REPOSITORY,
      inject: [
        PrismaService,
        AssessmentEligibilityService,
        AssessmentScoringService,
        WeakTopicService
      ],
      useFactory: (
        prismaService: PrismaService,
        eligibilityService: AssessmentEligibilityService,
        scoringService: AssessmentScoringService,
        weakTopicService: WeakTopicService
      ): AssessmentRepository =>
        new PrismaAssessmentRepository(
          prismaService,
          eligibilityService,
          scoringService,
          weakTopicService
        )
    }
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AssessmentModule {}
