# Frontend Architecture

## Target Framework

The frontend will use React, TypeScript, Vite, React Router, Tailwind CSS, Apollo Client, React Hook Form, and Zod.

## Application Structure

Use feature-oriented organization with shared primitives kept small.

```text
apps/web/src/
├── app/
│   ├── router.tsx
│   ├── apollo-client.ts
│   └── root-layout.tsx
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── weekly-plan/
│   ├── lessons/
│   ├── assessments/
│   ├── progress/
│   ├── partner/
│   ├── admin-content/
│   └── settings/
├── shared/
│   ├── components/
│   ├── forms/
│   ├── graphql/
│   ├── hooks/
│   └── utils/
└── test/
```

## Routing

| Route | Page |
| --- | --- |
| `/` | Landing or redirect to today dashboard if authenticated. |
| `/register` | Registration. |
| `/login` | Login. |
| `/onboarding` | Study Plan setup. |
| `/today` | Today dashboard. |
| `/plan/week/:weekNumber` | Weekly plan. |
| `/roadmap` | Longer track roadmap. |
| `/lessons/:dailyTaskId` | Scheduled lesson. |
| `/lessons/:dailyTaskId/exercise` | Exercise workspace. |
| `/assessments/:attemptId` | Weekly assessment. |
| `/assessments/:attemptId/result` | Assessment result. |
| `/progress` | Learner progress. |
| `/partner` | Partner dashboard. |
| `/profile` | Profile. |
| `/settings` | Settings. |
| `/admin/content` | Admin content list. |
| `/admin/lessons/:lessonId` | Admin lesson editor. |
| `*` | Not found. |

## Layouts

- Public layout: landing, registration, login.
- Authenticated learner layout: navigation to Today, Weekly Plan, Roadmap, Progress, Partner, Settings.
- Admin layout: content management routes for users with CONTENT_ADMIN role.
- Error layout: generic unrecoverable errors with safe retry and navigation.

## GraphQL Access

- Keep operation documents with the feature that owns the screen.
- Generate or type GraphQL operations when tooling is introduced.
- Use Apollo Client for server state.
- Include credentials for cookie sessions.
- Handle `AUTH_REQUIRED` globally by redirecting to login.
- Do not bypass GraphQL with ad hoc REST calls unless documented.

## Apollo Cache

- Normalize by `id` and `__typename`.
- Update cache after task completion, assessment submission, and partner invitation mutations.
- Prefer refetching dashboard and progress queries after complex scheduling changes.
- Do not store sensitive private data longer than needed in local component state.

## Local State

Use React state for:

- transient form UI;
- active tabs;
- local draft text before submit;
- optimistic UI labels.

Do not duplicate server-owned task status, assessment score, or partner visibility rules in local state.

## Forms and Validation

- Use React Hook Form.
- Use Zod schemas matching backend constraints.
- Show field-level errors and form-level safe messages.
- Disable duplicate submissions while mutation is pending.
- Preserve entered text after recoverable validation errors.

## Error Boundaries and States

Every route must define:

- loading state;
- empty state;
- success state;
- validation error state;
- permission error state;
- unexpected error state.

Assessment and lesson pages must preserve learner work during recoverable network errors.

## Accessibility

- Use semantic landmarks: header, nav, main, section, form.
- Provide labels for all form controls.
- Ensure keyboard operation for navigation, dialogs, assessment controls, and menus.
- Use visible focus states.
- Announce async form errors and success messages.
- Do not rely on color alone for progress or correctness.

## Responsive Strategy

- Mobile first from 360 px.
- Today dashboard keeps today's primary task first.
- Weekly plan can collapse to a day-by-day list on small screens.
- Tables require responsive alternatives for mobile.
- Do not render the five-month roadmap as the main dashboard.

## Testing

- Component tests for forms, dashboard cards, lesson completion, assessment controls, and partner views.
- Accessibility tests with axe for critical pages.
- Playwright tests for core flows.
- Mock GraphQL at the network boundary for frontend tests.
