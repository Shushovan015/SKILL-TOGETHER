# Functional Requirements

Priorities: P0 is required for MVP launch, P1 is required before broad beta, P2 is optional or later.

## Authentication

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-AUTH-001 | Register with email and password. | P0 | Visitor | Email not already registered. | Normalize email, validate password, hash password, create user and session. | Duplicate or invalid input returns safe validation error. | AC-AUTH-001 |
| FR-AUTH-002 | Log in with email and password. | P0 | User | User exists and password is valid. | Create secure server session and HTTP-only cookie. | Return `AUTH_INVALID_CREDENTIALS`; do not reveal whether email exists. | AC-AUTH-002 |
| FR-AUTH-003 | Log out. | P0 | Authenticated user | Active session. | Revoke session and clear cookie. | Idempotent success if already logged out. | AC-AUTH-003 |
| FR-AUTH-004 | Maintain authenticated sessions. | P0 | Authenticated user | Valid unexpired session cookie. | Resolve current user for GraphQL requests. | Expired or missing session returns `AUTH_REQUIRED`. | AC-AUTH-004 |

## Onboarding

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-ONBOARD-001 | Capture learner profile and preferences. | P0 | Learner | Authenticated account. | Save display name, time zone, experience level, target outcome, schedule preferences. | Invalid fields return validation errors. | AC-ONBOARD-001 |
| FR-ONBOARD-002 | Create Enrollment and Study Plan. | P0 | Learner | Valid Learning Track and schedule. | Create DRAFT then ACTIVE Enrollment with Study Plan, Study Weeks, and Daily Tasks. | Capacity conflicts return `PLAN_CAPACITY_EXCEEDED`. | AC-ONBOARD-002 |
| FR-ONBOARD-003 | Configure pause periods. | P1 | Learner | Active or draft Enrollment. | Store non-overlapping pause ranges and exclude them from planning. | Overlap or invalid dates return validation errors. | AC-ONBOARD-003 |

## Learning Tracks and Content

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-TRACK-001 | List predefined Learning Tracks. | P0 | Visitor, Learner | Seed data exists. | Return active Software Engineering, Project Management, and German tracks. | Empty state if no active tracks in development. | AC-TRACK-001 |
| FR-TRACK-002 | Browse Modules and Lessons. | P0 | Learner | Authenticated or public preview where allowed. | Show ordered modules, lessons, prerequisites, durations, and required status. | Unauthorized private views return `AUTH_REQUIRED`. | AC-TRACK-002 |
| FR-LESSON-001 | View scheduled Lesson. | P0 | Learner | Daily Task belongs to learner. | Show Lesson Version snapshot and required sections. | Unauthorized access returns `AUTH_FORBIDDEN`. | AC-LESSON-001 |
| FR-LESSON-002 | Complete Lesson task. | P0 | Learner | Daily Task is PLANNED or IN_PROGRESS. | Validate evidence, create Task Attempt, mark Daily Task COMPLETED. | Missing evidence returns `LESSON_EVIDENCE_REQUIRED`. | AC-LESSON-002 |
| FR-LESSON-003 | Record Learning Reflection. | P0 | Learner | Task Attempt exists. | Save short reflection linked to attempt. | Empty reflection allowed only if configured optional. | AC-LESSON-003 |

## Planning and Scheduling

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-PLAN-001 | Show today dashboard. | P0 | Learner | Active Enrollment. | Show today's main task, German task if enrolled, time, weekly progress, missed tasks, next assessment, partner summary. | No active Enrollment shows onboarding prompt. | AC-PLAN-001 |
| FR-PLAN-002 | Show weekly plan. | P0 | Learner | Active Enrollment. | Show Daily Tasks for selected Study Week with statuses. | Invalid week returns `PLAN_NOT_FOUND`. | AC-PLAN-002 |
| FR-PLAN-003 | Mark missed sessions. | P0 | System | Date passed and task incomplete. | Move eligible tasks to MISSED. | Completed tasks remain unchanged. | AC-PLAN-003 |
| FR-PLAN-004 | Reschedule missed sessions. | P0 | Learner, System | Missed task exists. | Propose deterministic recovery respecting prerequisites and capacity. | Unschedulable task returns reviewable conflict. | AC-PLAN-004 |
| FR-PLAN-005 | Pause and resume programme. | P1 | Learner | Active Enrollment. | Set PAUSED, stop new due tasks during pause, resume with adjusted future tasks. | Invalid pause returns validation error. | AC-PLAN-005 |

## Assessments

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-ASSESS-001 | Generate Weekly Assessment from eligible content. | P0 | System | Study Week has completed approved lessons. | Create Assessment Attempt from reviewed Assessment Version and eligible question pool. | No eligible content returns `ASSESSMENT_NOT_ELIGIBLE`. | AC-ASSESS-001 |
| FR-ASSESS-002 | Submit answers. | P0 | Learner | Active Assessment Attempt. | Validate answer formats and store Answer records. | Invalid format returns question-level errors. | AC-ASSESS-002 |
| FR-ASSESS-003 | Score assessment. | P0 | System, Admin | Submitted attempt. | Auto-score objective items and mark manual items pending. | Scoring error logs internal detail and returns retryable status. | AC-ASSESS-003 |
| FR-ASSESS-004 | Recommend revision. | P1 | System | Graded attempt. | Detect weak assessment tags and recommend lessons. | No weak topics returns general review guidance. | AC-ASSESS-004 |

## Partner Accountability

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-PARTNER-001 | Send partner invitation. | P0 | Learner | Authenticated account. | Create PENDING invitation with expiration. | Duplicate pending invitation returns `PARTNER_INVITATION_EXISTS`. | AC-PARTNER-001 |
| FR-PARTNER-002 | Accept or reject invitation. | P0 | Invited user | Valid invitation. | ACCEPTED creates Partner Connection; REJECTED closes invitation. | Expired invitation returns `PARTNER_INVITATION_EXPIRED`. | AC-PARTNER-002 |
| FR-PARTNER-003 | View shared progress. | P0 | Partner | Accepted Partner Connection. | Return scoped progress only. | Unauthorized access returns `AUTH_FORBIDDEN`. | AC-PARTNER-003 |
| FR-PARTNER-004 | Remove or block connection. | P1 | Learner, Partner | Existing connection. | Close sharing and optionally block future invitations. | Already removed is idempotent. | AC-PARTNER-004 |

## Administration

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-ADMIN-001 | Manage Lesson Versions. | P0 | Content Administrator | Admin role. | Create, edit DRAFT, move to REVIEWED, approve, or archive. | Non-admin returns `AUTH_FORBIDDEN`. | AC-ADMIN-001 |
| FR-ADMIN-002 | Manage Assessment Versions and Questions. | P0 | Content Administrator | Admin role. | Maintain reviewed question bank linked to tags and lesson versions. | Invalid question schema returns validation errors. | AC-ADMIN-002 |
| FR-ADMIN-003 | View content audit history. | P1 | Content Administrator | Admin role. | Show approval, archive, and version events. | Missing content returns `CONTENT_NOT_FOUND`. | AC-ADMIN-003 |

## AI Assistance

| ID | Description | Priority | Actors | Preconditions | Expected Behaviour | Failure Behaviour | Related AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-AI-001 | Request alternate explanation. | P2 | Learner | AI enabled and approved lesson content exists. | Send minimal grounded prompt through provider interface and return validated response. | Provider failure returns fallback message without blocking lesson. | AC-AI-001 |
| FR-AI-002 | Provide formative written feedback. | P2 | Learner | AI enabled and answer is eligible. | Return non-final feedback with confidence and limitations. | Invalid output is discarded and logged. | AC-AI-002 |
