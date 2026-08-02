# Design System

## Design Principles

- Calm, practical, and work-focused.
- Today's action is visually primary.
- Progress is informative, not punitive.
- Forms and controls are predictable.
- Accessibility is part of component definition.

## Semantic Color Roles

Use semantic roles instead of hard-coded brand meaning:

| Role | Use |
| --- | --- |
| Surface | Page and panel backgrounds. |
| Surface Muted | Secondary sections and subdued areas. |
| Text Primary | Main readable text. |
| Text Secondary | Supporting text. |
| Border | Dividers and control borders. |
| Action | Primary interactive elements. |
| Action Hover | Hover and active state for primary actions. |
| Success | Completed tasks and passed assessments. |
| Warning | Recoverable scheduling conflicts and pending grading. |
| Danger | Destructive actions and security-sensitive errors. |
| Focus | Keyboard focus outline. |

Do not rely on color alone; pair status color with text or icons.

## Typography

- Use a readable sans-serif system stack unless a brand typeface is later approved.
- Reserve large display text for landing or major page titles.
- Use compact headings inside dashboards, cards, sidebars, and admin tools.
- Do not scale font size directly with viewport width.
- Letter spacing should remain normal.

## Spacing and Layout

- Use an 8 px spacing scale.
- Keep page content width constrained for reading pages.
- Allow dashboard and admin pages to use wider layouts.
- Avoid cards nested inside cards.
- Use full-width sections or unframed layouts for major page regions.

## Breakpoints

| Breakpoint | Usage |
| --- | --- |
| 360 px | Minimum supported mobile width. |
| 640 px | Small tablet and large phone adjustments. |
| 768 px | Two-column layouts where useful. |
| 1024 px | Desktop navigation and dashboard grid. |
| 1280 px | Wide admin and roadmap views. |

## Components

### Buttons

- Primary for one main action.
- Secondary for non-primary actions.
- Destructive for removal, blocking, or deletion-like actions.
- Icon buttons require accessible labels and tooltips where meaning is not obvious.

### Inputs

- Every input has a visible label.
- Required fields are indicated in text.
- Errors appear near the field and in an accessible summary when useful.
- Numeric schedule fields use steppers or constrained inputs.

### Cards

- Use cards for repeated items such as tasks, lessons, partner summaries, and assessment results.
- Border radius should be 8 px or less unless later brand rules change.
- Do not place UI cards inside other cards.

### Navigation

- Primary nav remains consistent across authenticated pages.
- Current route is indicated visually and semantically.
- Mobile navigation must be reachable by keyboard.

### Dialogs

- Use dialogs for confirmation of important changes: recovery application, partner removal, blocking, destructive admin actions.
- Trap focus while open.
- Escape closes only non-destructive dialogs.

### Progress

- Show count and percentage.
- Include accessible text for screen readers.
- Avoid punitive streak-loss messages.

### Badges and Alerts

- Badges represent status such as PLANNED, COMPLETED, MISSED, REVIEWED.
- Alerts communicate validation, recovery conflicts, AI fallback, and security events.

### Tables

- Use tables for admin lists and audit logs.
- Provide responsive list alternatives on mobile.
- Include column headers and sortable controls where implemented.

### Assessment Controls

- Radio groups for multiple choice.
- Checkboxes for multiple select.
- Text areas for written answers.
- Code editor may be introduced later; MVP can use text area with monospace style.

### Empty States and Skeletons

- Empty states explain the current absence and next action.
- Skeletons should match final layout dimensions to avoid layout shift.

## Focus and Keyboard Use

- Focus outline must be visible against all surfaces.
- Tab order follows visual reading order.
- Skip link to main content is required.
- Keyboard users can complete onboarding, lessons, assessments, and partner flows.

## Motion

- Use short transitions for state changes.
- Respect reduced motion preference.
- Do not animate progress in a way that distracts from learning.

## Dark Mode

Dark mode is future scope. Define semantic colors now so it can be added later without rewriting component APIs.
