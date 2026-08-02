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

## Four-Week Representative Curriculum

Detailed lesson definitions live in:

- [33 Curriculum: Software Engineering](33-curriculum-software-engineering.md)
- [34 Curriculum: Project Management](34-curriculum-project-management.md)
- [35 Curriculum: German](35-curriculum-german.md)

Seed all first-four-week lessons as APPROVED Lesson Versions and seed reviewed assessment questions for each week.

## Sample Schedule

Main track schedule:

- Study days: Monday through Friday.
- Main session duration: 120 minutes.
- Assessment day: Friday.
- Recovery day: Saturday.

German schedule:

- Study days: Monday through Friday.
- Session duration: 30 to 60 minutes.
- Weekly review and short assessment on Friday.

## Sample Completed and Missed Tasks

Seed for test/demo:

- Software learner: week 1 day 1 completed, week 1 day 2 completed, week 1 day 3 missed, future tasks planned.
- Project learner: week 1 day 1 completed, week 1 day 2 planned.
- German learner: week 1 day 1 completed, week 1 day 2 missed.

## Sample Assessment

For each track week:

- multiple choice question;
- multiple select question;
- true/false question;
- short answer or scenario question;
- track-specific practical question.

Assessment Versions should be REVIEWED or APPROVED and linked to assessment tags from lessons.

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
