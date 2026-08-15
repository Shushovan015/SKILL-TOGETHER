# Seed Data

Seed data supports local development, automated tests, and demo flows. It must be idempotent and safe.

## Development Users

Use documented placeholder credentials only in local development. Do not commit real personal passwords.

| Role | Email | Password Source | Purpose |
| --- | --- | --- | --- |
| Software learner | `software.learner@example.test` | Shared local seed password from env or generated log. | Main Software Engineering flow. |
| Project learner | `project.learner@example.test` | Shared local seed password from env or generated log. | Project Management flow. |
| German learner | `german.learner@example.test` | Shared local seed password from env or generated log. | German-only testing. |
| Partner | `partner@example.test` | Shared local seed password from env or generated log. | Partner invitation and progress. |
| Content admin | `content.admin@example.test` | Shared local seed password from env or generated log. | Content management. |

Safe approach:

- Use `SEED_PASSWORD` in local `.env`.
- Hash the password during seeding.
- Refuse to run seed in production unless explicitly allowed.
- Make seeding idempotent by upserting on stable email, slug, and lesson identifiers.

## Roles

- Learners receive LEARNER.
- Content admin receives LEARNER and CONTENT_ADMIN.
- SYSTEM_ADMIN is not required for seed data unless an implementation phase needs operational testing.

## Tracks

| Track | Slug | Type |
| --- | --- | --- |
| Software Engineering | `software-engineering` | SOFTWARE_ENGINEERING |
| Project Management | `project-management` | PROJECT_MANAGEMENT |
| German | `german` | GERMAN |

## Seeded Curriculum Coverage

Detailed lesson definitions live in:

- [33 Curriculum: Software Engineering](33-curriculum-software-engineering.md)
- [34 Curriculum: Project Management](34-curriculum-project-management.md)
- [35 Curriculum: German](35-curriculum-german.md)

Software Engineering seed coverage:

- Complete five-to-six-month career programme.
- 14 professional phases, 24 weekly modules, and 120 approved learner-facing Lesson Versions.
- Each Software Engineering lesson includes 60/90/120-minute duration guidance, explanation, scenario, guided exercise, independent exercise, answer notes, knowledge checks, common mistakes, resources, interview questions, and portfolio or capstone linkage.
- The final phase is a five-session capstone for a production-style collaborative workflow platform with React, TypeScript, GraphQL boundary work, FastAPI, PostgreSQL, auth, authorization, security, tests, Docker, CI, deployment notes, ADRs, README, screenshots/demo notes, and retrospective.

Project Management seed coverage:

- 14 modules and 70 approved learner-facing sessions across foundations, initiation/scope, planning, resources/cost, risk/issues, stakeholders, communication, Agile delivery, quality/change, monitoring, professional workflows, career preparation, capstone, and final review.
- Every session exposes 30/60/90/120-minute paths; later phases include phase-specific mental models, decision frameworks, scenarios, complications, artifact fields, communication examples, review rubrics, and interview transfer.
- Every fifth session is tagged as a weekly professional assessment checkpoint.

For German, the seed stores complete learner-facing A1.1 through C2.2 learning-unit sessions as APPROVED Lesson Versions. These German sessions use the existing Lesson Version, Resource, Exercise, and Knowledge Check tables; no separate Learning Unit or Activity tables are required for the MVP seed.

## Sample Schedule

Main track schedule:

- Study days: Monday through Friday.
- Main session duration: 120 minutes.
- Assessment day: Friday.
- Recovery day: Saturday.
- Software Engineering now materializes 24 study weeks of approved career-program sessions.

German schedule:

- Study days: Monday through Friday.
- Session duration: 30, 45, 60, or 90 minutes.
- Complete Beginner maps to A1.1.
- Current and target levels support A1.1 through C2.2.
- Current architecture seed includes CEFR roadmap modules for A1.1 through C2.2.
- Detailed learner-facing German content includes 600 A1.1 through C2.2 sessions: 12 sublevels x 10 modules x 5 learning-unit sessions.
- Each implemented A2.1-C2.2 German session includes duration guidance for 30, 45, 60, and 90 minutes, in-app explanation, examples, guided and independent evidence tasks, a verified supplemental Goethe-Institut resource, and knowledge checks.
- Weekly review and short assessment remain the intended pattern for the later A1.1/A1.2 detailed expansion.

## Sample Completed and Missed Tasks

Seed for test/demo:

- Software learner: week 1 day 1 completed, week 1 day 2 completed, week 1 day 3 missed, future tasks planned.
- Project learner: week 1 day 1 completed, week 1 day 2 planned.
- German learner: week 1 day 1 completed, week 1 day 2 missed, using the available German detailed seed sessions for the configured start level. Detailed generated identifiers follow `DE-{level-code}-M{module}-S{session}`, for example `DE-A21-M01-S01` through `DE-C22-M10-S05`.

## Sample Assessment

For each track week:

- multiple choice question;
- multiple select question;
- true/false question;
- short answer or scenario question;
- track-specific practical question.

Assessment Versions should be REVIEWED or APPROVED and linked to assessment tags from lessons.

Software Engineering assessment seed behavior:

- Reviewed question seeds are generated from approved Software Engineering lesson assessment tags.
- Every studied tag receives a professional assessment set: knowledge, explain/application, coding challenge, debugging challenge, architecture/design case study, interview answer, and interview feedback/reflection.
- Coding, debugging, design, interview, and reflection items use manual grading mode in the current MVP assessment engine.
- Assessment selection prefers a mix of available question types before filling the remaining weekly question limit.

German assessment seed behavior:

- German reviewed question seeds are generated from approved module-level German curriculum assessment tags.
- Internal structural tags such as CEFR labels, module numbers, and generic unit competency labels are not treated as examinable topics.
- Each assessable German tag receives CEFR-aware multiple-choice, multiple-select, scenario, and reflection items.
- Final sublevel assessment lessons use the same tag path and can therefore surface in weekly/periodic assessment selection after completion.

## Partner Connection

Seed:

- one accepted Partner Connection between `software.learner@example.test` and `partner@example.test`;
- one PENDING invitation from project learner to partner;
- one EXPIRED invitation for lifecycle testing.

## Admin User

The content admin should have enough draft content to test:

- DRAFT Lesson Version;
- REVIEWED Lesson Version awaiting approval;
- APPROVED Lesson Version used in schedule;
- ARCHIVED Lesson Version not eligible for new schedules.

## Idempotent Seed Behaviour

- Use stable slugs and identifiers.
- Upsert records by natural keys.
- Avoid duplicating modules, lessons, questions, invitations, or connections.
- Reset demo task statuses only in test seed mode, not development mode unless explicitly requested.
