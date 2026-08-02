# Acceptance Criteria

This file maps stable acceptance criteria to functional requirements and expected test levels.

Test levels:

- U: unit
- I: integration
- G: GraphQL/API
- C: component
- E: end-to-end
- A: accessibility
- S: security

## Authentication

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-AUTH-001 | FR-AUTH-001 | Registration normalizes email, rejects duplicates, hashes password, creates profile, and issues HTTP-only session cookie. | I, G, C, E, S |
| AC-AUTH-002 | FR-AUTH-002 | Login accepts valid credentials, rejects invalid credentials with safe error, rate-limits repeated failures, and rotates session. | I, G, C, E, S |
| AC-AUTH-003 | FR-AUTH-003 | Logout revokes active session, clears cookie, and succeeds idempotently. | I, G, C, E |
| AC-AUTH-004 | FR-AUTH-004 | Authenticated requests resolve current user; expired or missing sessions return `AUTH_REQUIRED`. | I, G, S |

## Onboarding

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-ONBOARD-001 | FR-ONBOARD-001 | Learner can save profile and schedule preferences with field validation and accessible errors. | G, C, E, A |
| AC-ONBOARD-002 | FR-ONBOARD-002 | Valid onboarding creates ACTIVE Enrollment, Study Plan, Study Weeks, and Daily Tasks without exceeding capacity. | U, I, G, E |
| AC-ONBOARD-003 | FR-ONBOARD-003 | Pause periods reject invalid ranges and are excluded from future scheduling. | U, I, G |

## Learning Tracks and Lessons

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-TRACK-001 | FR-TRACK-001 | Active predefined Software Engineering, Project Management, and German tracks are listed from seed data. | I, G, C |
| AC-TRACK-002 | FR-TRACK-002 | Learner can browse ordered modules and lessons with durations, prerequisites, and required flags. | G, C, E |
| AC-LESSON-001 | FR-LESSON-001 | Scheduled Lesson page shows only the learner-owned Daily Task and its approved Lesson Version snapshot. | G, C, E, S |
| AC-LESSON-002 | FR-LESSON-002 | Completing a task validates evidence, stores Task Attempt snapshot, updates status to COMPLETED, and updates progress. | U, I, G, C, E |
| AC-LESSON-003 | FR-LESSON-003 | Learning Reflection is saved with default PRIVATE visibility and can be linked to task or week. | I, G, C |

## Planning and Scheduling

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-PLAN-001 | FR-PLAN-001 | Today dashboard shows today's tasks, study time, weekly progress, missed tasks, next assessment, and partner summary. | I, G, C, E, A |
| AC-PLAN-002 | FR-PLAN-002 | Weekly Plan shows Daily Tasks grouped by date with PLANNED, IN_PROGRESS, COMPLETED, MISSED, RESCHEDULED, SKIPPED, and CANCELLED states. | G, C, E |
| AC-PLAN-003 | FR-PLAN-003 | Missed detection marks only past incomplete tasks MISSED and is idempotent. | U, I |
| AC-PLAN-004 | FR-PLAN-004 | Recovery proposals respect prerequisites, capacity, optional-before-required adjustment, and never move completed tasks. | U, I, G, E |
| AC-PLAN-005 | FR-PLAN-005 | Pause and resume preserve completed work and shift only future incomplete tasks. | U, I, G |

## Assessments

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-ASSESS-001 | FR-ASSESS-001 | Weekly Assessment is created only from completed approved lessons and reviewed questions. | U, I, G |
| AC-ASSESS-002 | FR-ASSESS-002 | Answer submission validates response shape for each question type and preserves submitted answers. | I, G, C, E |
| AC-ASSESS-003 | FR-ASSESS-003 | Objective scoring calculates percentage and pass/fail; manual items enter pending state. | U, I, G, E |
| AC-ASSESS-004 | FR-ASSESS-004 | Weak-topic detection maps low-scoring tags to revision recommendations. | U, I, C |

## Partner Accountability

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-PARTNER-001 | FR-PARTNER-001 | Learner can send a pending invitation with expiration; duplicate pending invitations are rejected. | I, G, C |
| AC-PARTNER-002 | FR-PARTNER-002 | Invitee can accept or reject; expired invitations cannot be accepted. | I, G, E |
| AC-PARTNER-003 | FR-PARTNER-003 | Partner sees only approved progress summary fields and no private notes, exact answers, AI conversations, or credentials. | I, G, E, S |
| AC-PARTNER-004 | FR-PARTNER-004 | Either user can remove connection; blocking revokes invitations and prevents future ones. | I, G, C |

## Administration

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-ADMIN-001 | FR-ADMIN-001 | Content Admin can create draft, submit review, approve, and archive Lesson Versions with audit events. | I, G, C, E, S |
| AC-ADMIN-002 | FR-ADMIN-002 | Assessment question management validates question schema, tags, answer keys, and status before approval. | U, I, G |
| AC-ADMIN-003 | FR-ADMIN-003 | Admin audit history shows safe event metadata for content lifecycle changes. | I, G, C |

## AI

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-AI-001 | FR-AI-001 | Alternate explanation uses approved content, minimal context, schema validation, rate limiting, and safe fallback. | U, I, G, C |
| AC-AI-002 | FR-AI-002 | Formative feedback is marked non-final, rejects invalid provider output, and logs redacted metadata. | U, I, G, S |

## Page-Level Criteria

| AC ID | Requirement | Criteria | Test Levels |
| --- | --- | --- | --- |
| AC-PAGE-001 | Page specs | Public landing routes anonymous users to registration or login and authenticated users to Today. | C, E |
| AC-PAGE-002 | Page specs | Unknown routes show not-found page with safe navigation. | C |
| AC-PAGE-003 | Page specs | Error boundary shows safe error message, retry action, and request ID when available. | C, A |
