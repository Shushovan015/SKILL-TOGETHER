# Curriculum: German

The German curriculum is now organized as a professional CEFR-aligned internal language program from A1.1 through C2.2. It is not affiliated with, approved by, or certified by Goethe-Institut, VHS, telc, OeSD, or another institution.

## Entry Points

- [Program framework](curriculum/german/00-program-framework.md)
- [CEFR competency map](curriculum/german/01-cefr-competency-map.md)
- [Grammar progression](curriculum/german/02-grammar-progression.md)
- [Vocabulary progression](curriculum/german/03-vocabulary-progression.md)
- [Speaking progression](curriculum/german/04-speaking-progression.md)
- [Listening progression](curriculum/german/05-listening-progression.md)
- [Reading progression](curriculum/german/06-reading-progression.md)
- [Writing progression](curriculum/german/07-writing-progression.md)
- [Pronunciation progression](curriculum/german/08-pronunciation-progression.md)
- [Mediation progression](curriculum/german/09-mediation-progression.md)
- [Cultural/pragmatic competence](curriculum/german/10-cultural-competence.md)
- [Assessment framework](curriculum/german/11-assessment-framework.md)
- [Resource framework](curriculum/german/12-resource-framework.md)
- [Session authoring standard](curriculum/german/13-session-authoring-standard.md)

## Level Files

- [A1.1](curriculum/german/levels/A1.1.md)
- [A1.2](curriculum/german/levels/A1.2.md)
- [A2.1](curriculum/german/levels/A2.1.md)
- [A2.2](curriculum/german/levels/A2.2.md)
- [B1.1](curriculum/german/levels/B1.1.md)
- [B1.2](curriculum/german/levels/B1.2.md)
- [B2.1](curriculum/german/levels/B2.1.md)
- [B2.2](curriculum/german/levels/B2.2.md)
- [C1.1](curriculum/german/levels/C1.1.md)
- [C1.2](curriculum/german/levels/C1.2.md)
- [C2.1](curriculum/german/levels/C2.1.md)
- [C2.2](curriculum/german/levels/C2.2.md)

## Architecture Summary

The pedagogical hierarchy is:

German -> CEFR sublevel -> module -> learning unit -> activity -> daily session.

Learning units represent teachable content. Activities represent concrete study actions with estimated duration, priority, skill tags, and review status. Daily sessions are composed deterministically for 30, 45, 60, or 90 minutes without cutting activities halfway.

## Current Implementation Boundary

The application currently stores the proof slice in the existing Learning Track, Module, Lesson, Lesson Version, Exercise, Resource, Enrollment, Study Plan, Study Week, and Daily Task model.

Implemented in seed data for this architecture phase:

- German roadmap modules for A1.1 through C2.2.
- German enrollment current/target level support through C2.2.
- Duration configuration for 30, 45, 60, and 90 minutes.
- Complete A1.1 and A1.2 beginner pathways with 10 modules and 50 learning-unit sessions per sublevel.
- Fully authored A2.1 Modules 1-2 production benchmark sessions.
- Complete learner-facing A2.1 through C2.2 seed implementation: 10 sublevels x 10 modules x 5 learning-unit sessions, stored as approved Lesson Versions with resources, exercises, knowledge checks, evidence prompts, and sublevel final integrated assessment sessions.
- CEFR-aware German assessment seed items for approved lesson tags, including objective knowledge checks, multiple-select skill checks, productive scenarios, and reflection prompts.

Not implemented in this phase:

- A human-reviewed official-exam-style assessment item bank beyond the internal seed questions.
- Speech recognition.
- AI tutoring.
- Official exam certification.
