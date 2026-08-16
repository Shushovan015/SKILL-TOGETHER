# Scheduling Engine

## Purpose

The scheduling engine creates and adjusts Daily Tasks for a learner's Study Plan. It is deterministic for the MVP and must not depend on AI.

## Inputs

- Programme start date.
- Preferred study days.
- Available minutes per study day.
- Preferred session time.
- Learning Track.
- Current experience level.
- Target outcome.
- Assessment day.
- Recovery day.
- Pause periods.
- Ordered Lessons with prerequisites, duration, required flag, and approved version.
- Existing Daily Tasks and Task Attempts.

## Constraints

- Required prerequisites must be completed before dependent required lessons.
- Completed tasks must never be automatically rescheduled.
- Daily planned minutes must not exceed configured availability.
- Optional content is moved, shortened, or skipped before required content is delayed.
- A single missed session should not destroy the weekly schedule.
- Automatic decisions must be explainable.
- Important rescheduling changes must be reviewable by the learner.
- Dates are evaluated in the learner's configured time zone.

## Initial Planning Algorithm

Study Weeks and Daily Tasks are persisted in bulk inside a single transaction. The transaction uses an explicit extended timeout so larger level ranges can be created reliably against a production database without leaving a partially generated plan.

```text
function createStudyPlan(enrollment, lessons, preferences):
  approvedLessons = lessons.filter(status == APPROVED)
  ordered = topologicalSortByPrerequisitesThenSequence(approvedLessons)
  weeks = createStudyWeeks(enrollment.startDate, preferences.studyDays)
  for lesson in ordered:
    slot = firstAvailableSlot(weeks, lesson.duration, preferences, lesson.prerequisites)
    if slot is missing:
      recordPlanningConflict(lesson, "NO_CAPACITY")
      continue
    createDailyTask(slot.date, lesson.versionId, lesson.duration, lesson.required)
  scheduleWeeklyAssessments(weeks, preferences.assessmentDay)
  return plan
```

## Missed-Task Detection

A task becomes MISSED when:

- scheduled date is before today's local date;
- status is PLANNED;
- no completed Task Attempt exists.

IN_PROGRESS tasks remain active and appear on the Today dashboard until the learner completes them, including on a later day. Completed, SKIPPED, CANCELLED, and RESCHEDULED tasks are not marked MISSED.

When an active track has no task scheduled today and no future planned task, its earliest MISSED task appears as the track's resumable session on Today. Resuming changes that task to IN_PROGRESS without rewriting completed work.

## Recovery Options

Ranked order:

1. Move missed required lesson to configured recovery day if capacity exists.
2. Move missed required lesson to next available study day if capacity exists.
3. Move optional tasks from a future day to create capacity.
4. Shorten or skip optional content.
5. Delay dependent required lessons.
6. Create a short recovery session if configured capacity allows.
7. Ask learner to review conflict manually.

## Recovery Algorithm

```text
function proposeRecovery(missedTask, plan):
  assert missedTask.status == MISSED
  if missedTask.isCompleted:
    return noChange("COMPLETED_TASK")

  candidates = recoveryDates(plan, missedTask)
  for date in candidates:
    if hasCapacity(date, missedTask.duration):
      return proposal("MOVE_TO_DATE", date)

  optionalMove = findOptionalTaskToMove(plan, missedTask.duration)
  if optionalMove:
    return proposal("MOVE_OPTIONAL_AND_INSERT_REQUIRED", optionalMove)

  optionalSkip = findOptionalTaskToSkip(plan, missedTask.duration)
  if optionalSkip:
    return proposal("SKIP_OPTIONAL_AND_INSERT_REQUIRED", optionalSkip)

  dependentDelay = findDependentRequiredTasks(plan, missedTask)
  if dependentDelay.canDelayWithinCapacity:
    return proposal("DELAY_DEPENDENTS", dependentDelay)

  return conflict("NO_VALID_RECOVERY_SLOT")
```

## Conflict Resolution

Conflict results must include:

- task ID;
- reason code;
- impacted lessons;
- capacity calculation;
- prerequisite impact;
- suggested learner choices.

The learner can choose to:

- accept the proposal;
- select another valid date;
- intentionally skip optional lesson;
- pause programme;
- leave task missed for now.

## Pause and Resume

Pause:

- Enrollment becomes PAUSED.
- No new tasks become due during pause.
- Existing completed attempts remain unchanged.

Resume:

- Enrollment returns to ACTIVE.
- Future uncompleted tasks shift after pause range.
- Completed tasks remain on their historical dates.
- Assessment windows are recalculated for future weeks only.

## Time Zones and DST

- Store user time zone on UserProfile.
- Calculate local due dates in that time zone.
- Store planned dates as `date`, not midnight timestamps.
- Preferred session time can move through daylight-saving transitions according to local civil time.
- Audit timestamp still uses `timestamptz`.

## Idempotency

- Running missed detection twice must not create duplicate changes.
- Recovery proposal generation is read-only.
- Applying a proposal uses an idempotency key and verifies the task status has not changed.
- Background jobs can safely retry.

## Audit History

Record:

- task marked MISSED;
- recovery proposal accepted;
- task rescheduled;
- optional task skipped;
- dependent task delayed;
- pause and resume.

Audit metadata must be safe and not include private notes or assessment answers.

## Acceptance Examples

### Single Missed Required Lesson

Given Monday's required lesson is missed and Friday is the configured recovery day with enough capacity, the engine proposes moving the missed lesson to Friday and leaves completed tasks unchanged.

### Optional Content Conflict

Given a missed required lesson and the next available day has one optional lesson, the engine proposes moving or skipping the optional lesson before delaying required content.

### Prerequisite Conflict

Given Lesson B requires Lesson A and Lesson A is missed, Lesson B is delayed until after Lesson A is completed or rescheduled earlier.

### Pause Period

Given a learner pauses for one week, future incomplete tasks shift after the pause and completed tasks keep their original dates.

## Edge Cases

- No approved lesson version exists: create planning conflict for admin review.
- Study day capacity is zero: reject onboarding preference.
- Assessment day is not a study day: allowed, but assessment duration must fit configured availability or separate assessment capacity.
- Multiple tracks: main track and German track are scheduled independently, then combined dashboard capacity is checked.
- User changes time zone: future date calculations use new time zone; historical snapshots remain unchanged.

## German Duration-Aware Session Composition

German scheduling must not treat one topic as one fixed study day. The German curriculum source hierarchy is CEFR sublevel -> Module -> Learning Unit -> Activity -> Daily Session. The session composer chooses whole activities for the learner's configured duration.

Initial deterministic composition rules:

1. Normalize Complete Beginner to A1.1.
2. Include only German content at or above the start sublevel and at or below the target sublevel.
3. Select required CORE activities first.
4. Add deterministic review activities when due.
5. Add RECOMMENDED activities while capacity remains.
6. Add EXTENSION activities only when the duration supports them.
7. Never split an activity halfway to fit time.
8. Preserve skill balance across the week: listening, speaking, reading, writing, vocabulary, grammar, pronunciation, interaction, mediation where appropriate, and pragmatic competence.

The persistence query filters German Lessons by the stored Lesson `difficulty` level before scheduling. This database-level boundary ensures a plan starting at A2.2 cannot receive A1.1, A1.2, or A2.1 Daily Tasks; the application-level range check remains as defense in depth.

Supported German durations are 30, 45, 60, and 90 minutes. Current MVP persistence materializes proof-slice German sessions as approved Lesson Versions with the scheduled Daily Task carrying the selected duration. Future normalized composer work should output a Daily Task session plan from Learning Unit and Activity records rather than duplicating complete lessons for every duration.

## Professional Track Duration Paths

Software Engineering and Project Management lesson versions retain the complete 120-minute authored session. Onboarding supports 30, 60, 90, and 120 minutes. During planning, the Daily Task duration is capped to the learner's selected study-day capacity while lesson order, prerequisites, and assessment tags remain unchanged. Learner-facing lesson content labels what belongs in each duration path; shorter paths prioritize the mental model and core guided work before independent, verification, interview, and portfolio extensions.
