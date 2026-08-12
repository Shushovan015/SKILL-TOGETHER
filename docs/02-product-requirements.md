# Product Requirements

## Executive Summary

SkillTogether helps learners complete structured four-to-six-month learning programmes by replacing daily planning decisions with a guided Study Plan, complete Lesson content, weekly assessments, missed-session recovery, and privacy-preserving partner accountability.

The MVP supports predefined Software Engineering, Project Management, and German Learning Tracks. It must be useful before any AI feature is enabled.

## Problem Statement

Learners struggle to remain consistent when they repeatedly need to choose topics, resources, exercises, assessment methods, and recovery actions. Existing task tools track work but rarely provide the complete learning path, content, evidence model, assessment, and recovery rules in one experience.

## Background

The first release is designed for two learners: one learning software engineering, one learning project management. Both may also study German. The MVP baseline requires detailed seed content for an initial four-week programme, and the current seed expands that baseline with a complete Software Engineering career programme plus extended German coverage.

## Target Users

- Software Engineering Learner
- Project Management Learner
- German Learner
- Accountability Partner
- Content Administrator

Detailed personas are in [03 User Personas](03-user-personas.md).

## Goals

- Reduce daily learning decisions to one primary action.
- Provide complete lessons with evidence-based completion.
- Support configurable study schedules.
- Preserve progress when lessons or assessments are revised.
- Detect missed sessions and offer recovery that respects daily capacity.
- Provide weekly assessment and weak-topic feedback.
- Share progress with partners without exposing private data.
- Establish implementation-ready architecture and task phases.

## Non-Goals

MVP exclusions are authoritative in [07 MVP Scope](07-mvp-scope.md) and include payments, subscriptions, public profiles, leaderboards, native mobile apps, real-time chat, certificates, calendar integrations, organization accounts, and complex AI agents.

## Assumptions

| ID | Assumption | Impact |
| --- | --- | --- |
| A-001 | MVP learners use email/password login. | Enables cookie sessions without external identity providers. |
| A-002 | Main learning sessions default to two hours. | Scheduling uses duration capacity. |
| A-003 | German sessions take 30, 45, 60, or 90 minutes. | German can be scheduled alongside a main track while preserving learner-specific duration. |
| A-004 | Weekly assessments use predefined reviewed questions first. | Reduces AI and quality risk. |
| A-005 | Initial deployment can use vendor-neutral managed hosting. | Avoids premature vendor lock-in. |

Uncertain decisions are recorded in [38 Decisions](38-decisions.md).

## Constraints

- Use the approved stack in `AGENTS.md`.
- Use deterministic MVP scheduling.
- Do not silently rewrite completed results when content changes.
- Only approved content may appear in official weekly assessments.
- Partner access must be explicitly scoped.
- All private data access must be authorized server-side.
- Accessibility target is WCAG 2.2 AA.

## Core Workflows

### Registration and Onboarding

1. Visitor creates an account with email and password.
2. System creates a secure cookie session.
3. Learner configures profile, Learning Track, start date, study days, available time, assessment day, recovery day, and pause periods.
4. System creates an Enrollment, Study Plan, initial Study Weeks, and Daily Tasks.

### Daily Learning

1. Learner opens the dashboard.
2. System shows today's main Daily Task, German task if configured, estimated study time, weekly progress, overdue work, next assessment, and partner progress.
3. Learner opens a Lesson, completes exercises and checks, records evidence, and submits a short Learning Reflection.
4. System records a Task Attempt and updates progress.

### Weekly Assessment

1. System determines eligible completed approved lessons for the Study Week.
2. Learner completes predefined questions.
3. Objective answers are automatically scored.
4. Manual or AI-assisted feedback may be attached within documented boundaries.
5. System records weak topics and recommends revision.

### Missed-Session Recovery

1. System marks uncompleted past Daily Tasks as MISSED.
2. Scheduling service proposes recovery actions based on prerequisites, available time, and optional content.
3. Learner reviews important rescheduling changes.
4. Completed work remains unchanged.

### Partner Accountability

1. Learner invites a partner.
2. Partner accepts before expiration.
3. Partner sees shared progress summary only.
4. Either party can remove or block the connection.

## Detailed Requirements

Functional requirements are defined in [05 Functional Requirements](05-functional-requirements.md). Non-functional requirements are defined in [06 Non-Functional Requirements](06-non-functional-requirements.md).

## Business Rules

- A Daily Task is a scheduled instance and is separate from reusable Lesson content.
- Completed Task Attempts store snapshot fields for lesson title, content version, objectives, duration, completion evidence, assessment tags, and scoring inputs.
- Required prerequisites must be completed before dependent required lessons.
- Optional content may be shortened, moved, or skipped before required content is delayed.
- The schedule must not exceed the learner's configured daily availability.
- A single missed session must not fail the whole plan.
- Only APPROVED Lesson Versions and reviewed Assessment Versions are eligible for official Weekly Assessments.
- AI may assist explanation and formative feedback but must not silently change curriculum, control scheduling, decide authorization, or independently grade objective questions.

## Success Metrics

| Metric | MVP Target |
| --- | --- |
| Onboarding completion | At least 90% of pilot users create a Study Plan. |
| Weekly completion | At least 70% of planned required Daily Tasks completed in pilot weeks. |
| Recovery usage | At least 80% of missed sessions receive a valid proposed recovery option. |
| Assessment completion | At least 70% of eligible weekly assessments submitted. |
| Partner activation | At least 50% of invited partners accept in pilot testing. |
| Accessibility | Critical user flows pass automated axe checks and manual keyboard review. |

## Risks

| Risk | Mitigation |
| --- | --- |
| Curriculum scope becomes too large. | Detail four weeks first; outline later months. |
| Scheduling rules become opaque. | Use deterministic rules with audit history and explanations. |
| Partner visibility exposes private data. | Enforce scoped progress DTOs and authorization tests. |
| AI output quality varies. | Keep AI optional, grounded, validated, and non-authoritative. |
| Assessment integrity is weak. | Version assessments and use reviewed question banks. |

## Dependencies

- Approved curriculum seed content.
- PostgreSQL availability for local and production environments.
- Email capability for future password reset and verification.
- Hosting provider selection before production deployment.
- Admin review process for lesson and assessment approval.

## Release Strategy

1. Documentation and architecture baseline.
2. Foundation monorepo and CI.
3. Authentication and onboarding.
4. Learning Track, Lesson, and scheduling vertical slice.
5. Weekly assessments.
6. Partner accountability.
7. AI assistance behind feature flags.
8. Hardening and deployment.

Implementation phases are detailed in [30 Implementation Roadmap](30-implementation-roadmap.md).
