# Page Specifications

Each page must define loading, empty, error, and permission states during implementation.

| Page | Route | Purpose | Actors | Entry Conditions | Data Requirements | Primary Action | Secondary Actions | States | Permissions | Responsive Behaviour | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Landing | `/` | Explain product and direct users. | Visitor | None. | Public track summary. | Register. | Login. | Loading not expected; safe error if config unavailable. | Anonymous. | Concise single column on mobile. | AC-PAGE-001 |
| Registration | `/register` | Create account. | Visitor | Not authenticated. | None. | Submit registration. | Login link. | Field validation, duplicate email, success redirect. | Anonymous only. | Full-width form on mobile. | AC-AUTH-001 |
| Login | `/login` | Start session. | Visitor | Not authenticated. | None. | Submit login. | Register link, password reset future. | Invalid credentials, rate limit, success redirect. | Anonymous only. | Full-width form on mobile. | AC-AUTH-002 |
| Onboarding | `/onboarding` | Configure Study Plan. | Learner | Authenticated, no active Enrollment or editing draft. | Learning Tracks, preferences. | Activate plan. | Save draft, cancel. | Track loading, no tracks, capacity error. | Owner only. | Multi-step or stacked sections on mobile. | AC-ONBOARD-001 |
| Today Dashboard | `/today` | Show today's learning focus. | Learner | Authenticated. | Today tasks, progress, missed tasks, next assessment, partner summary. | Start or continue task. | Recover missed task, view week. | No enrollment, no task today, loading, auth error. | Owner only. | Today's task first on all sizes. | AC-PLAN-001 |
| Weekly Plan | `/plan/week/:weekNumber` | Show weekly schedule. | Learner | Active Enrollment. | Study Week, Daily Tasks, statuses. | Open task. | Propose recovery, go to assessment. | Empty week, conflict, loading. | Owner only. | Day sections on mobile; grid on desktop. | AC-PLAN-002 |
| Roadmap | `/roadmap` | Show long-term modules and progress. | Learner | Active Enrollment. | Track modules, lessons, completion summaries. | Open current lesson or week. | Filter module. | No roadmap, loading. | Owner only. | Collapsible modules on mobile. | AC-TRACK-002 |
| Lesson | `/lessons/:dailyTaskId` | Complete scheduled lesson. | Learner | Daily Task belongs to learner. | Scheduled Lesson snapshot, checks, resources. | Complete task. | Start task, request AI help if enabled. | Missing task, permission, validation, AI fallback. | Owner only. | Content first, sticky action only if non-overlapping. | AC-LESSON-001 |
| Exercise | `/lessons/:dailyTaskId/exercise` | Focus on guided or independent exercise. | Learner | Task belongs to learner. | Exercise prompt and expected evidence. | Save evidence. | Return to lesson. | Draft saved, validation error. | Owner only. | Single-column workspace on mobile. | AC-LESSON-002 |
| Weekly Assessment | `/assessments/:attemptId` | Answer assessment questions. | Learner | Eligible attempt. | Questions, saved answers, timer if configured. | Submit assessment. | Save draft, exit. | Not eligible, manual pending, validation. | Owner only. | One question per section on mobile. | AC-ASSESS-002 |
| Assessment Result | `/assessments/:attemptId/result` | Show score and revision. | Learner | Submitted or graded attempt. | Score, feedback, weak topics, recommendations. | Review weak topics. | Retake if available. | Pending manual grading, no result. | Owner only. | Summary first, detailed feedback below. | AC-ASSESS-003 |
| Progress | `/progress` | Show learner progress. | Learner | Active Enrollment. | ProgressSnapshot, streak, completion, assessments. | View week or roadmap. | Export future. | No progress yet, loading. | Owner only. | Charts degrade to text summaries. | AC-PLAN-001 |
| Partner | `/partner` | Manage partner accountability. | Learner, Partner | Authenticated. | Invitations, connections, shared progress. | Invite partner. | Accept, reject, remove, block. | No partner, pending invitation, permission. | Connection-scoped. | Cards stack on mobile. | AC-PARTNER-001 |
| Profile | `/profile` | Edit profile basics. | Learner | Authenticated. | UserProfile. | Save profile. | Change password future. | Validation, saved. | Owner only. | Simple form. | AC-ONBOARD-001 |
| Settings | `/settings` | Manage schedule, privacy, sessions. | Learner | Authenticated. | Study Plan preferences, sharing settings. | Save settings. | Pause programme, remove partner. | Conflict, validation, success. | Owner only. | Grouped sections. | AC-PLAN-005 |
| Admin Content List | `/admin/content` | Manage lessons and assessments. | Content Administrator | Admin role. | Lesson Versions, Assessment Versions. | Create draft. | Filter status, approve, archive. | Empty list, permission denied. | CONTENT_ADMIN. | Responsive table or list. | AC-ADMIN-001 |
| Admin Lesson Editor | `/admin/lessons/:lessonId` | Edit Lesson Version. | Content Administrator | Admin role and draft or new version. | Lesson fields, resources, exercises. | Save draft. | Submit review, approve, archive. | Validation, version conflict. | CONTENT_ADMIN. | Long form with anchored sections. | AC-ADMIN-001 |
| Not Found | `*` | Handle unknown route. | Any | Unknown route. | None. | Return home. | Login or today link. | Static. | Any. | Centered content. | AC-PAGE-002 |
| Generic Error | route boundary | Recover from unexpected UI error. | Any | Error boundary catches exception. | Request ID if available. | Retry. | Return home. | Error state. | Any. | Message and actions visible on mobile. | AC-PAGE-003 |

## Page-Level Rules

- All private pages must handle `AUTH_REQUIRED`.
- Owner-only pages must handle `AUTH_FORBIDDEN`.
- Mutations must prevent duplicate submissions.
- Error messages must use safe user-facing language from [37 API Error Catalogue](37-api-error-catalogue.md).
- Each page must include automated accessibility coverage before MVP exit.
