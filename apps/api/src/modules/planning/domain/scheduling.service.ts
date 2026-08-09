import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type {
  ApprovedLessonForScheduling,
  PlanPreferences,
  ScheduleDraft,
  ScheduledTaskDraft,
  StudyWeekDraft
} from "./planning.types.js";

const maxPlanningDays = 730;

export class SchedulingDomainService {
  public createSchedule(
    lessons: readonly ApprovedLessonForScheduling[],
    preferences: PlanPreferences
  ): ScheduleDraft {
    const orderedLessons = topologicalSort(lessons);
    const tasks: ScheduledTaskDraft[] = [];
    const weeksByNumber = new Map<number, StudyWeekDraft>();
    const usedMinutesByDate = new Map<string, number>();
    const scheduledDateByLessonId = new Map<string, Date>();

    for (const lesson of orderedLessons) {
      const earliestDate = this.earliestDateForLesson(
        lesson,
        preferences.startDate,
        scheduledDateByLessonId
      );
      const scheduledOn = this.findSlot(earliestDate, lesson.durationMinutes, preferences, usedMinutesByDate);
      const week = weekForDate(preferences.startDate, scheduledOn);
      weeksByNumber.set(week.weekNumber, week);
      tasks.push({
        lessonVersionId: lesson.lessonVersionId,
        scheduledOn,
        plannedDurationMinutes: lesson.durationMinutes,
        required: lesson.required,
        weekNumber: week.weekNumber
      });
      usedMinutesByDate.set(
        dateKey(scheduledOn),
        (usedMinutesByDate.get(dateKey(scheduledOn)) ?? 0) + lesson.durationMinutes
      );
      scheduledDateByLessonId.set(lesson.lessonId, scheduledOn);
    }

    return {
      weeks: [...weeksByNumber.values()].sort((left, right) => left.weekNumber - right.weekNumber),
      tasks
    };
  }

  private earliestDateForLesson(
    lesson: ApprovedLessonForScheduling,
    startDate: Date,
    scheduledDateByLessonId: ReadonlyMap<string, Date>
  ): Date {
    const prerequisiteDates = lesson.prerequisiteLessonIds
      .map((lessonId) => scheduledDateByLessonId.get(lessonId))
      .filter((date): date is Date => date !== undefined);

    if (prerequisiteDates.length === 0) {
      return startDate;
    }

    return addDays(
      prerequisiteDates.reduce((latest, current) =>
        current.getTime() > latest.getTime() ? current : latest
      ),
      1
    );
  }

  private findSlot(
    earliestDate: Date,
    durationMinutes: number,
    preferences: PlanPreferences,
    usedMinutesByDate: ReadonlyMap<string, number>
  ): Date {
    const maxDailyCapacity = Math.max(...Object.values(preferences.availableMinutesByDay));

    if (durationMinutes > maxDailyCapacity) {
      throw capacityError();
    }

    for (let offset = 0; offset < maxPlanningDays; offset += 1) {
      const candidate = addDays(earliestDate, offset);

      if (
        !isStudyDate(candidate, preferences) ||
        isPaused(candidate, preferences) ||
        !hasCapacity(candidate, durationMinutes, preferences, usedMinutesByDate)
      ) {
        continue;
      }

      return candidate;
    }

    throw capacityError();
  }
}

export function hasCapacity(
  date: Date,
  durationMinutes: number,
  preferences: PlanPreferences,
  usedMinutesByDate: ReadonlyMap<string, number>
): boolean {
  const available = preferences.availableMinutesByDay[dayOfWeek(date)] ?? 0;
  const used = usedMinutesByDate.get(dateKey(date)) ?? 0;
  return used + durationMinutes <= available;
}

export function isStudyDate(date: Date, preferences: PlanPreferences): boolean {
  return preferences.studyDays.includes(dayOfWeek(date)) || preferences.recoveryDay === dayOfWeek(date);
}

export function isPaused(date: Date, preferences: PlanPreferences): boolean {
  return preferences.pausePeriods.some(
    (pausePeriod) => date >= pausePeriod.startsOn && date <= pausePeriod.endsOn
  );
}

export function weekForDate(startDate: Date, date: Date): StudyWeekDraft {
  const weekNumber = Math.floor(daysBetween(startDate, date) / 7) + 1;
  const startsOn = addDays(startDate, (weekNumber - 1) * 7);

  return {
    weekNumber,
    startsOn,
    endsOn: addDays(startsOn, 6)
  };
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function dayOfWeek(date: Date): number {
  return date.getUTCDay();
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function daysBetween(startDate: Date, endDate: Date): number {
  return Math.floor((dateOnly(endDate).getTime() - dateOnly(startDate).getTime()) / 86_400_000);
}

export function dateOnly(date: Date): Date {
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

function topologicalSort(
  lessons: readonly ApprovedLessonForScheduling[]
): readonly ApprovedLessonForScheduling[] {
  const byLessonId = new Map(lessons.map((lesson) => [lesson.lessonId, lesson]));
  const sorted: ApprovedLessonForScheduling[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const ordered = [...lessons].sort(
    (left, right) =>
      left.moduleSequence - right.moduleSequence || left.lessonSequence - right.lessonSequence
  );

  function visit(lesson: ApprovedLessonForScheduling): void {
    if (visited.has(lesson.lessonId)) {
      return;
    }

    if (visiting.has(lesson.lessonId)) {
      throw createApiGraphqlError({
        code: "VALIDATION_FAILED",
        message: apiErrorMessages.VALIDATION_FAILED,
        retryable: false,
        field: "prerequisites"
      });
    }

    visiting.add(lesson.lessonId);

    for (const prerequisiteLessonId of lesson.prerequisiteLessonIds) {
      const prerequisite = byLessonId.get(prerequisiteLessonId);

      if (prerequisite !== undefined) {
        visit(prerequisite);
      }
    }

    visiting.delete(lesson.lessonId);
    visited.add(lesson.lessonId);
    sorted.push(lesson);
  }

  for (const lesson of ordered) {
    visit(lesson);
  }

  return sorted;
}

function capacityError(): Error {
  return createApiGraphqlError({
    code: "PLAN_CAPACITY_EXCEEDED",
    message: apiErrorMessages.PLAN_CAPACITY_EXCEEDED,
    retryable: false,
    field: "availableMinutesByDay"
  });
}
