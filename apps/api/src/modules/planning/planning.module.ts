import { Module } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { LessonCompletionService } from "./domain/lesson-completion.service.js";
import { RecoveryDomainService } from "./domain/recovery.service.js";
import { SchedulingDomainService } from "./domain/scheduling.service.js";
import { PLANNING_REPOSITORY, type PlanningRepository } from "./persistence/planning.repository.js";
import { PrismaPlanningRepository } from "./persistence/prisma-planning.repository.js";
import { PlanningResolver } from "./planning.resolver.js";
import { PlanningService } from "./planning.service.js";

@Module({
  imports: [AuthModule],
  providers: [
    PlanningResolver,
    PlanningService,
    SchedulingDomainService,
    RecoveryDomainService,
    LessonCompletionService,
    {
      provide: PLANNING_REPOSITORY,
      inject: [
        PrismaService,
        SchedulingDomainService,
        RecoveryDomainService,
        LessonCompletionService
      ],
      useFactory: (
        prismaService: PrismaService,
        schedulingService: SchedulingDomainService,
        recoveryService: RecoveryDomainService,
        lessonCompletionService: LessonCompletionService
      ): PlanningRepository =>
        new PrismaPlanningRepository(
          prismaService,
          schedulingService,
          recoveryService,
          lessonCompletionService
        )
    }
  ]
})
// NestJS module classes are intentionally metadata-only; the decorator defines the module.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PlanningModule {}
