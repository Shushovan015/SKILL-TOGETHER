# GraphQL API Design

This contract is implementation-ready but not yet implemented.

## Scalars

```graphql
scalar Date
scalar DateTime
scalar Time
scalar JSON
```

## Enums

```graphql
enum TrackType { SOFTWARE_ENGINEERING PROJECT_MANAGEMENT GERMAN }
enum EnrollmentStatus { DRAFT ACTIVE PAUSED COMPLETED CANCELLED }
enum DailyTaskStatus { PLANNED IN_PROGRESS COMPLETED MISSED RESCHEDULED SKIPPED CANCELLED }
enum ContentStatus { DRAFT REVIEWED APPROVED ARCHIVED }
enum InvitationStatus { PENDING ACCEPTED REJECTED EXPIRED REVOKED }
enum AssessmentAttemptStatus { NOT_STARTED IN_PROGRESS SUBMITTED NEEDS_MANUAL_GRADING GRADED PASSED FAILED }
enum QuestionType { MULTIPLE_CHOICE MULTIPLE_SELECT TRUE_FALSE SHORT_ANSWER CODE_CHALLENGE DEBUGGING_CHALLENGE SCENARIO CASE_STUDY PRACTICAL_ASSIGNMENT REFLECTION }
enum ReflectionVisibility { PRIVATE PARTNER_VISIBLE }
```

## Shared Types

```graphql
type User {
  id: ID!
  email: String!
  profile: UserProfile!
  roles: [String!]!
}

type UserProfile {
  displayName: String!
  timeZone: String!
  preferredSessionTime: Time
}

type ApiError {
  code: String!
  message: String!
  field: String
  retryable: Boolean!
}
```

## Authentication

```graphql
input RegisterInput {
  email: String!
  password: String!
  displayName: String!
  timeZone: String!
}

input LoginInput {
  email: String!
  password: String!
}

type AuthPayload {
  user: User!
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  logout: Boolean!
}

type Query {
  me: User
}
```

Authentication requirements:

- `register`, `login`, and public track preview are anonymous.
- All other user data operations require an authenticated session.
- Mutations require CSRF protection.

## Learning Tracks and Enrollment

```graphql
type LearningTrack {
  id: ID!
  slug: String!
  type: TrackType!
  title: String!
  description: String!
  modules: [Module!]!
}

type Module {
  id: ID!
  sequence: Int!
  title: String!
  summary: String!
  lessons: [LessonSummary!]!
}

type LessonSummary {
  id: ID!
  slug: String!
  sequence: Int!
  title: String!
  difficulty: String!
  estimatedDurationMinutes: Int!
  required: Boolean!
  prerequisites: [ID!]!
}

input OnboardingInput {
  trackId: ID!
  startDate: Date!
  studyDays: [Int!]!
  availableMinutesByDay: JSON!
  preferredSessionTime: Time
  experienceLevel: String!
  targetOutcome: String!
  assessmentDay: Int!
  recoveryDay: Int!
  pausePeriods: [PausePeriodInput!] = []
}

input PausePeriodInput {
  startsOn: Date!
  endsOn: Date!
  reason: String
}

type Enrollment {
  id: ID!
  status: EnrollmentStatus!
  track: LearningTrack!
  startDate: Date!
  targetOutcome: String!
}

extend type Query {
  learningTracks(activeOnly: Boolean = true): [LearningTrack!]!
  enrollment(id: ID!): Enrollment!
}

extend type Mutation {
  completeOnboarding(input: OnboardingInput!): Enrollment!
}
```

## Daily Plan and Lessons

```graphql
type TodayDashboard {
  date: Date!
  mainTask: DailyTask
  germanTask: DailyTask
  estimatedStudyMinutes: Int!
  weeklyProgress: ProgressSummary!
  missedTasks: [DailyTask!]!
  nextAssessment: AssessmentAttemptSummary
  partnerProgress: [PartnerProgressSummary!]!
}

type DailyTask {
  id: ID!
  scheduledOn: Date!
  status: DailyTaskStatus!
  plannedDurationMinutes: Int!
  required: Boolean!
  lesson: ScheduledLesson!
  rescheduleReason: String
}

type ScheduledLesson {
  lessonVersionId: ID!
  title: String!
  moduleTitle: String!
  learningObjective: String!
  outcomes: [String!]!
  explanationMarkdown: String!
  businessRelevanceMarkdown: String!
  examples: JSON!
  guidedExercise: Exercise!
  independentExercise: Exercise!
  knowledgeChecks: [KnowledgeCheck!]!
  commonMistakes: [String!]!
  resources: [Resource!]!
}

type Exercise {
  id: ID!
  kind: String!
  promptMarkdown: String!
  expectedEvidence: String!
}

type Resource {
  title: String!
  url: String!
  resourceType: String!
  required: Boolean!
}

type KnowledgeCheck {
  id: ID!
  question: String!
}

input CompleteDailyTaskInput {
  dailyTaskId: ID!
  durationMinutes: Int!
  completionEvidence: JSON!
  reflection: String
}

input RescheduleTaskInput {
  dailyTaskId: ID!
  strategy: String!
  targetDate: Date
}

extend type Query {
  todayDashboard(date: Date): TodayDashboard!
  weeklyPlan(weekNumber: Int!): [DailyTask!]!
  dailyTask(id: ID!): DailyTask!
}

extend type Mutation {
  startDailyTask(id: ID!): DailyTask!
  completeDailyTask(input: CompleteDailyTaskInput!): DailyTask!
  proposeRecovery(dailyTaskId: ID!): RecoveryProposal!
  applyRecovery(input: RescheduleTaskInput!): [DailyTask!]!
}
```

## Assessments

```graphql
type AssessmentAttempt {
  id: ID!
  status: AssessmentAttemptStatus!
  studyWeekNumber: Int!
  questions: [AssessmentQuestion!]!
  result: AssessmentResult
}

type AssessmentQuestion {
  id: ID!
  type: QuestionType!
  promptMarkdown: String!
  options: JSON
  points: Int!
}

input AssessmentAnswerInput {
  questionId: ID!
  response: JSON!
}

input SubmitAssessmentInput {
  attemptId: ID!
  answers: [AssessmentAnswerInput!]!
}

type AssessmentResult {
  scoreEarned: Float!
  scorePossible: Float!
  percentage: Float!
  passed: Boolean!
  weakTopics: [String!]!
  revisionRecommendations: [DailyTask!]!
}

extend type Query {
  weeklyAssessment(studyWeekId: ID!): AssessmentAttempt!
  assessmentResult(attemptId: ID!): AssessmentResult!
}

extend type Mutation {
  startWeeklyAssessment(studyWeekId: ID!): AssessmentAttempt!
  submitAssessment(input: SubmitAssessmentInput!): AssessmentAttempt!
}
```

## Partner Invitations and Progress

```graphql
type PartnerInvitation {
  id: ID!
  inviteeEmail: String!
  status: InvitationStatus!
  expiresAt: DateTime!
}

type PartnerProgressSummary {
  userId: ID!
  displayName: String!
  plannedSessionCount: Int!
  completedSessionCount: Int!
  weeklyCompletionPercentage: Float!
  currentStreak: Int!
  assessmentCompleted: Boolean!
  overallTrackProgressPercentage: Float!
  encouragementStatus: String
}

input InvitePartnerInput {
  email: String!
}

extend type Query {
  partnerInvitations: [PartnerInvitation!]!
  partnerProgress: [PartnerProgressSummary!]!
}

extend type Mutation {
  invitePartner(input: InvitePartnerInput!): PartnerInvitation!
  acceptPartnerInvitation(invitationId: ID!): PartnerInvitation!
  rejectPartnerInvitation(invitationId: ID!): PartnerInvitation!
  removePartnerConnection(connectionId: ID!): Boolean!
  blockUser(userId: ID!): Boolean!
}
```

## Administration

```graphql
type AdminLessonVersion {
  id: ID!
  lessonId: ID!
  version: Int!
  status: ContentStatus!
  title: String!
  assessmentTags: [String!]!
}

input LessonVersionInput {
  lessonId: ID!
  title: String!
  learningObjective: String!
  outcomes: [String!]!
  explanationMarkdown: String!
  businessRelevanceMarkdown: String!
  examples: JSON!
  exercises: JSON!
  resources: JSON!
  commonMistakes: [String!]!
  assessmentTags: [String!]!
}

extend type Query {
  adminLessonVersions(status: ContentStatus): [AdminLessonVersion!]!
}

extend type Mutation {
  createLessonVersion(input: LessonVersionInput!): AdminLessonVersion!
  submitLessonVersionForReview(id: ID!): AdminLessonVersion!
  approveLessonVersion(id: ID!): AdminLessonVersion!
  archiveLessonVersion(id: ID!): AdminLessonVersion!
}
```

## Pagination

Use cursor pagination for admin lists and audit logs:

```graphql
type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}
```

## Expected Errors

Return stable codes from [37 API Error Catalogue](37-api-error-catalogue.md), including `AUTH_REQUIRED`, `AUTH_FORBIDDEN`, `VALIDATION_FAILED`, `PLAN_CAPACITY_EXCEEDED`, `ASSESSMENT_NOT_ELIGIBLE`, and `PARTNER_INVITATION_EXPIRED`.

## Side Effects

- `completeOnboarding` creates Enrollment, Study Plan, Study Weeks, and Daily Tasks.
- `completeDailyTask` creates Task Attempt, snapshots content, updates progress, and may unlock assessment eligibility.
- `applyRecovery` changes future Daily Tasks and writes audit events.
- `submitAssessment` stores answers and starts scoring.
- `acceptPartnerInvitation` creates Partner Connection and audit event.
- Admin approval changes content eligibility for future schedules only.
