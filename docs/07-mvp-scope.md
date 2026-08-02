# MVP Scope

## MVP Goal

Deliver a usable private learning accountability platform where learners can register, configure a Study Plan, complete daily Lesson tasks, recover missed sessions, complete predefined Weekly Assessments, view progress, and share progress with an accountability partner.

## Included Capabilities

- Registration, login, logout, and authenticated sessions.
- User onboarding with predefined Learning Track selection.
- Configurable study schedule: start date, preferred study days, available time, preferred session time, experience level, target outcome, assessment day, recovery day, and pause periods.
- Modules, Lessons, Lesson Versions, resources, exercises, and knowledge checks.
- Daily Tasks and weekly Study Plan views.
- Today dashboard focused on today's lesson, German session if configured, time, progress, missed work, next assessment, and partner progress.
- Lesson completion with completion evidence, study-time recording, and short Learning Reflection.
- Deterministic missed-session rescheduling.
- Predefined reviewed Weekly Assessments.
- Assessment results, scoring, weak-topic detection, and revision recommendations.
- Progress dashboard.
- Partner invitation, acceptance, shared progress, removal, and blocking.
- Basic administrator content management.
- Development seed data.
- Responsive accessible UI.
- Automated tests.
- Docker-based local development.
- CI pipeline.
- Production deployment documentation.

## Excluded Capabilities

- Payments and subscriptions.
- Public course marketplace.
- Public social profiles.
- Leaderboards.
- Native mobile applications.
- Public chat.
- Video hosting.
- Certificates.
- Organization accounts.
- Complex AI agents.
- Voice tutoring.
- Calendar integrations.
- Real-time messaging.
- Automatically generated full curricula.
- Production AI grading without review controls.

Excluded capabilities belong in [08 Future Scope](08-future-scope.md), not MVP implementation tasks.

## Release Constraints

- The MVP must work without AI enabled.
- Weekly assessments must use predefined reviewed questions first.
- Deterministic scheduling must run without background AI decisions.
- Content versioning and assessment versioning must be implemented before learners can complete official tasks.
- Partner progress must use a limited sharing model from [20 Accountability System](20-accountability-system.md).
- All implementation phases must pass the validation commands documented in `AGENTS.md` once package scripts exist.

## MVP Success Criteria

- A learner can complete onboarding and see a valid Study Plan.
- A learner can complete at least one full week of scheduled main-track lessons.
- A learner can complete German sessions if enrolled.
- A missed required task produces a valid recovery proposal.
- A learner can submit a Weekly Assessment and receive a result.
- A partner can accept an invitation and view only permitted progress.
- A Content Administrator can approve content used by the official schedule.
- Critical flows pass automated and manual accessibility checks.

## Exit Criteria

- All P0 functional requirements in [05 Functional Requirements](05-functional-requirements.md) are implemented and tested.
- All MVP acceptance criteria in [31 Acceptance Criteria](31-acceptance-criteria.md) pass.
- Security controls in [26 Security](26-security.md) are implemented for authentication, authorization, CSRF, XSS, and GraphQL abuse.
- Production deployment runbook in [28 Deployment](28-deployment.md) has been exercised in a staging or preview environment.
- No future-scope feature is required to complete the core learner journey.
