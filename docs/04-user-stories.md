# User Stories

Acceptance criteria identifiers are defined fully in [31 Acceptance Criteria](31-acceptance-criteria.md). This file groups user stories by feature.

## Authentication

### US-AUTH-001 Registration

As a visitor, I want to register with email and password so that I can create a private learning account.

Acceptance criteria:

- The system normalizes email before account creation.
- Duplicate normalized emails are rejected.
- Passwords are hashed before storage.
- A secure HTTP-only session cookie is issued after successful registration.

### US-AUTH-002 Login and Logout

As a registered user, I want to log in and log out so that my account remains secure on shared devices.

Acceptance criteria:

- Valid credentials create a session.
- Invalid credentials return a safe error message.
- Logout invalidates the server session and clears the cookie.

## Onboarding and Study Plan

### US-ONBOARD-001 Configure Programme

As a learner, I want to choose a Learning Track and schedule preferences so that the system can create my Study Plan.

Acceptance criteria:

- The learner selects track, experience level, target outcome, start date, study days, available time, assessment day, recovery day, and optional pause periods.
- The system validates schedule capacity before activating the Enrollment.
- The dashboard has at least one planned Daily Task after onboarding.

## Lessons

### US-LESSON-001 Complete Today's Lesson

As a learner, I want today's Lesson to contain explanation, examples, exercises, checks, and resources so that I do not need to search elsewhere.

Acceptance criteria:

- The Lesson page shows the approved snapshot linked to the scheduled Daily Task.
- The learner can submit completion evidence and a short Learning Reflection.
- Completion creates a Task Attempt and moves the Daily Task to COMPLETED.

### US-LESSON-002 Preserve Historical Results

As a learner, I want my completed work to remain stable when lesson content changes so that my history stays trustworthy.

Acceptance criteria:

- Completed Task Attempts store snapshot values.
- A later Lesson Version does not alter historical Task Attempt content or scoring inputs.

## Scheduling and Recovery

### US-PLAN-001 Weekly Plan

As a learner, I want to see this week's plan so that I understand upcoming lessons without seeing an overwhelming five-month calendar.

Acceptance criteria:

- The weekly page shows planned, completed, missed, rescheduled, skipped, and cancelled tasks.
- The roadmap is available separately from the main dashboard.

### US-PLAN-002 Missed Session Recovery

As a learner, I want missed sessions to be recovered calmly so that one missed day does not ruin the plan.

Acceptance criteria:

- Past incomplete tasks become MISSED.
- The scheduling engine proposes deterministic recovery actions.
- Required prerequisites stay respected.
- Completed tasks are never automatically rescheduled.

## Assessments

### US-ASSESS-001 Weekly Assessment

As a learner, I want a weekly assessment based on completed lessons so that I can verify understanding.

Acceptance criteria:

- Only approved content and reviewed questions are eligible.
- Objective questions are scored automatically.
- Written or practical questions are marked manual or AI-assisted according to grading rules.
- Weak topics generate revision recommendations.

## Partner Accountability

### US-PARTNER-001 Invite Partner

As a learner, I want to invite a partner so that they can support my consistency.

Acceptance criteria:

- Invitations expire if not accepted.
- Accepted invitations create a Partner Connection.
- Rejected, revoked, or expired invitations cannot create a connection.

### US-PARTNER-002 Shared Progress

As a partner, I want to see progress summary only so that I can encourage without invading privacy.

Acceptance criteria:

- Partner views include planned count, completed count, weekly completion percentage, streak, assessment completion, overall track progress, and optional encouragement state.
- Partner views exclude private notes, exact answers, AI conversations, authentication data, and unshared personal details.

## Administration

### US-ADMIN-001 Manage Content

As a Content Administrator, I want to manage Lesson Versions and Assessment Versions so that learners receive reviewed content.

Acceptance criteria:

- Draft content can be edited.
- Only valid reviewed content can be approved.
- Archived content is not scheduled for new official tasks.
- Approval and archival are audited.

## AI Assistance

### US-AI-001 Explain Differently

As a learner, I want optional AI explanations grounded in approved lesson content so that I can understand difficult topics.

Acceptance criteria:

- AI requests include only necessary lesson and learner context.
- Responses are schema-validated.
- AI failure never blocks deterministic lesson completion, scheduling, or authorization.
