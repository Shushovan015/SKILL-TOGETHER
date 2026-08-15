import { toEnrollmentDto } from "../content/content.mapper.js";
import type {
  DailyTaskRecord,
  PlanningEnrollmentRecord,
  RecoveryProposalRecord,
  TodayDashboardRecord
} from "./domain/planning.types.js";
import {
  DailyTaskDto,
  DailyTaskStatusDto,
  EnrollmentDto,
  RecoveryProposalDto,
  TodayDashboardDto
} from "./dto/planning.dto.js";

export function toPlanningEnrollmentDto(enrollment: PlanningEnrollmentRecord): EnrollmentDto {
  return toEnrollmentDto({
    ...enrollment,
    totalTaskCount: 0,
    completedTaskCount: 0,
    overallProgressPercentage: 0,
    currentDailyTaskId: null,
    currentLessonId: null,
    currentModuleTitle: null,
    currentLessonTitle: null,
    completedLessonIds: []
  });
}

export function toDailyTaskDto(task: DailyTaskRecord): DailyTaskDto {
  return {
    id: task.id,
    studyWeekId: task.studyWeekId,
    scheduledOn: task.scheduledOn,
    status: task.status as DailyTaskStatusDto,
    plannedDurationMinutes: task.plannedDurationMinutes,
    required: task.required,
    lesson: {
      lessonVersionId: task.lesson.lessonVersionId,
      title: task.lesson.title,
      moduleTitle: task.lesson.moduleTitle,
      trackSlug: task.lesson.trackSlug,
      trackTitle: task.lesson.trackTitle,
      difficulty: task.lesson.difficulty,
      learningObjective: task.lesson.learningObjective,
      outcomes: [...task.lesson.outcomes],
      explanationMarkdown: task.lesson.explanationMarkdown,
      businessRelevanceMarkdown: task.lesson.businessRelevanceMarkdown,
      examples: [...task.lesson.examples],
      guidedExercise: { ...task.lesson.guidedExercise },
      independentExercise: { ...task.lesson.independentExercise },
      knowledgeChecks: task.lesson.knowledgeChecks.map((knowledgeCheck) => ({
        ...knowledgeCheck
      })),
      commonMistakes: [...task.lesson.commonMistakes],
      resources: task.lesson.resources.map((resource) => ({ ...resource }))
    },
    rescheduleReason: task.rescheduleReason,
    studyWeekNumber: task.studyWeekNumber
  };
}

export function toTodayDashboardDto(dashboard: TodayDashboardRecord): TodayDashboardDto {
  return {
    date: dashboard.date,
    tasks: dashboard.tasks.map(toDailyTaskDto),
    mainTask: dashboard.mainTask === null ? null : toDailyTaskDto(dashboard.mainTask),
    germanTask: dashboard.germanTask === null ? null : toDailyTaskDto(dashboard.germanTask),
    estimatedStudyMinutes: dashboard.estimatedStudyMinutes,
    weeklyProgress: {
      plannedCount: dashboard.weeklyProgress.plannedCount,
      completedCount: dashboard.weeklyProgress.completedCount,
      weeklyCompletionPercentage: dashboard.weeklyProgress.weeklyCompletionPercentage
    },
    missedTasks: dashboard.missedTasks.map(toDailyTaskDto),
    nextAssessment: null,
    partnerProgress: []
  };
}

export function toRecoveryProposalDto(proposal: RecoveryProposalRecord): RecoveryProposalDto {
  return {
    dailyTaskId: proposal.dailyTaskId,
    strategy: proposal.strategy,
    targetDate: proposal.targetDate,
    reason: proposal.reason,
    impactedTaskIds: [...proposal.impactedTaskIds],
    capacityMinutes: proposal.capacityMinutes,
    plannedMinutes: proposal.plannedMinutes
  };
}
