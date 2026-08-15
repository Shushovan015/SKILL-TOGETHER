import type { LessonVersionEditorInput } from "../domain/content.types.js";
import {
  findGermanCurriculumLesson,
  type GermanCurriculumLessonDefinition,
  type GermanImplementedLevel,
  type GermanUnitNumber
} from "./german-curriculum-data.js";
import type { SeedLessonDefinition } from "./phase-03-seed-data.js";

type GermanGeneratedContent = Pick<
  LessonVersionEditorInput,
  | "outcomes"
  | "explanationMarkdown"
  | "relevanceMarkdown"
  | "examples"
  | "commonMistakes"
  | "resources"
  | "exercises"
  | "knowledgeChecks"
>;

interface LevelProfile {
  readonly cefrBand: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  readonly label: string;
  readonly inputStyle: string;
  readonly productionStyle: string;
  readonly mediationStyle: string;
  readonly phrases: readonly string[];
  readonly mistakes: readonly string[];
}

interface UnitFocus {
  readonly label: string;
  readonly inputTask: string;
  readonly outputTask: string;
  readonly checkFocus: string;
}

export function germanCompleteContentForLesson(lesson: SeedLessonDefinition): GermanGeneratedContent | null {
  const definition = findGermanCurriculumLesson(lesson.identifier);

  if (definition === null) {
    return null;
  }

  const profile = profileFor(definition.module.level);
  const unit = unitFocusFor(definition.unit.unitNumber);
  const primaryPhrase = phraseFor(profile, definition.unit.unitNumber);
  const secondaryPhrase = phraseFor(profile, nextUnitNumber(definition.unit.unitNumber));

  return {
    outcomes: outcomesFor(definition, profile, unit),
    explanationMarkdown: explanationFor(definition, profile, unit, primaryPhrase, secondaryPhrase),
    relevanceMarkdown: relevanceFor(definition, profile),
    examples: examplesFor(definition, profile, primaryPhrase, secondaryPhrase),
    commonMistakes: commonMistakesFor(definition, profile),
    resources: [
      {
        title: "Practise German for free",
        provider: "Goethe-Institut",
        url: "https://www.goethe.de/en/spr/ueb.html",
        resourceType: "EXTRA_PRACTICE",
        difficulty: definition.module.level,
        estimatedMinutes: 10,
        description:
          "Optional reinforcement after the in-app lesson. The core explanations, answer keys, tasks, and checks are included in this session.",
        verificationStatus: "VERIFIED",
        required: false,
        approved: true,
        citation: "Goethe-Institut: Practise German for free"
      }
    ],
    exercises: [
      {
        kind: "guided",
        promptMarkdown: guidedPromptFor(definition, profile, unit, primaryPhrase),
        expectedEvidence: "Completed guided answers, corrections from the answer notes, and one revised German sentence.",
        solutionNotesMarkdown: guidedSolutionFor(definition, primaryPhrase)
      },
      {
        kind: "independent",
        promptMarkdown: independentPromptFor(definition, profile),
        expectedEvidence: lesson.evidence,
        solutionNotesMarkdown: independentRubricFor(definition, profile)
      }
    ],
    knowledgeChecks: knowledgeChecksFor(definition, profile, unit, primaryPhrase)
  };
}

function explanationFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  unit: UnitFocus,
  primaryPhrase: string,
  secondaryPhrase: string
): string {
  const finalAssessment = isSublevelFinalAssessment(definition)
    ? "\n\nSublevel final integrated assessment: this session collects evidence across listening, reading, mediation, speaking, writing, grammar control, vocabulary range, pronunciation, and reflection for the current sublevel."
    : "";

  return [
    "How to use this session with your available time:\n30 minutes: retrieval, core input, one controlled answer set, and the knowledge check.\n45 minutes: add pronunciation plus a short spoken or written response.\n60 minutes: complete the guided path. This should take about 55-65 active minutes.\n90 minutes: add partner or self-study recording, mediation, revision, and reflection.",
    `Learning focus: ${definition.title}. Work at ${profile.label}; the session focus is ${unit.label.toLowerCase()}.`,
    `Core language: start from \`${primaryPhrase}\`, add vocabulary for ${definition.module.vocabularyFocus}, and show ${definition.module.grammarFocus}. Expansion: \`${secondaryPhrase}\`.`,
    audioScriptFor(definition, profile, unit),
    readingTaskFor(definition, profile),
    `Grammar/vocabulary: mark ${definition.module.grammarFocus}; circle words for ${definition.module.vocabularyFocus}. Then write one fact, one question, and one reason or contrast.`,
    `Pronunciation: focus on ${definition.module.pronunciationFocus}. Say the core phrase slowly, then naturally, and mark one clarity improvement.`,
    `Production path: ${unit.outputTask}. Partner route: exchange roles and ask one follow-up. Self-study route: record both sides, listen again, and rewrite the weakest sentence.${finalAssessment}`
  ].join("\n\n");
}

function audioScriptFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  unit: UnitFocus
): string {
  return [
    "Audio script for later recording",
    `Context: two speakers handle ${definition.module.communicativePurpose}; the input sounds ${profile.inputStyle}.`,
    ...audioLinesFor(definition, profile),
    `First listen: identify situation and action. Second listen: write vocabulary field, grammar focus, and evidence task. Answer key: ${unit.inputTask}.`
  ].join("\n");
}

function readingTaskFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): string {
  return [
    "Reading text and answer key",
    `Text: ${readingTextFor(definition, profile)}`,
    `Tasks: What is being prepared? Which structure helps? Rewrite the last sentence in your own German. Expected answers: ${definition.module.moduleEvidence}; situation, facts, reason, next step, follow-up question; answer style: ${profile.productionStyle}.`,
    `Mediation note: ${profile.mediationStyle}. Keep the meaning stable even when your wording changes.`
  ].join("\n\n");
}

function audioLinesFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): readonly string[] {
  switch (profile.cefrBand) {
    case "A1":
      return [
        `Person A: Guten Tag. Ich uebe heute ${definition.module.title}.`,
        `Person B: Hallo. Wichtig sind ${definition.module.vocabularyFocus}.`,
        `Person A: Mein Ziel ist: ${definition.module.moduleEvidence}.`,
        "Person B: Gut. Sprechen Sie langsam. Fragen Sie nach, wenn etwas unklar ist."
      ];
    case "A2":
      return [
        `Speaker A: Ich brauche Hilfe bei "${definition.module.title}".`,
        `Speaker B: Gern. Wichtig sind ${definition.module.vocabularyFocus}.`,
        `Speaker A: Ich moechte ${definition.module.moduleEvidence}.`,
        `Speaker B: Dann nennen Sie bitte die Situation, einen Grund und die naechste Handlung.`
      ];
    case "B1":
      return [
        `Speaker A: Ich bereite "${definition.module.title}" vor und muss die wichtigsten Punkte ordnen.`,
        `Speaker B: Dann erklaeren Sie zuerst die Situation, danach den Grund und am Ende die Empfehlung.`,
        `Speaker A: Ich nutze Wortschatz zu ${definition.module.vocabularyFocus} und achte auf ${definition.module.grammarFocus}.`,
        `Speaker B: Gut. Die andere Person sollte danach wissen, was zu tun ist.`
      ];
    case "B2":
      return [
        `Speaker A: Bei "${definition.module.title}" reicht eine einfache Meinung nicht; ich brauche eine begruendete Position.`,
        `Speaker B: Genau. Verbinden Sie ${definition.module.vocabularyFocus} mit einem Beispiel, einer Einschraenkung und einer Empfehlung.`,
        `Speaker A: Sprachlich achte ich auf ${definition.module.grammarFocus}, damit die Argumentation kohaerent bleibt.`,
        `Speaker B: Formulieren Sie ausserdem so, dass der Ton zur beruflichen oder institutionellen Situation passt.`
      ];
    case "C1":
      return [
        `Speaker A: Im Kontext "${definition.module.title}" muss ich mehrere Perspektiven verdichten, ohne die Nuancen zu verlieren.`,
        `Speaker B: Trennen Sie Quelle, Einordnung und Bewertung; sonst klingt die Synthese wie eine blosse Nacherzaehlung.`,
        `Speaker A: Ich beruecksichtige ${definition.module.vocabularyFocus} und nutze ${definition.module.grammarFocus} fuer praezise Beziehungen zwischen den Aussagen.`,
        `Speaker B: Entscheidend ist, dass Register, implizite Bedeutung und Adressatenbezug erkennbar bleiben.`
      ];
    case "C2":
      return [
        `Speaker A: "${definition.module.title}" verlangt nicht nur Korrektheit, sondern eine bewusste Steuerung von Ton, Andeutung und Gewichtung.`,
        `Speaker B: Richtig. Die zentrale Aussage darf verdichtet werden, aber Ambiguitaet, Ironie oder institutionelle Nuancen duerfen nicht geglaettet werden.`,
        `Speaker A: Ich setze ${definition.module.vocabularyFocus} gezielt ein und nutze ${definition.module.grammarFocus}, um rhetorische Wirkung und Praezision auszubalancieren.`,
        `Speaker B: Die Leistung ist ueberzeugend, wenn die Zielperson zugleich Bedeutung, Haltung, Grenzen und Handlungsspielraum erkennt.`
      ];
  }
}

function readingTextFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): string {
  switch (profile.cefrBand) {
    case "A1":
      return `Hallo! Ich lerne Deutsch. Heute arbeite ich mit ${definition.module.title}. Ich lese kurze Saetze, hoere genau zu und benutze Woerter fuer ${definition.module.vocabularyFocus}. Danach kann ich ${definition.module.moduleEvidence}. Ich spreche langsam und frage: "Wie bitte?", wenn ich etwas nicht verstehe.`;
    case "A2":
      return `Im Kurs ${definition.module.level} geht es um ${definition.module.title}. Lernende sammeln Informationen, pruefen Details und bereiten ${definition.module.moduleEvidence} vor. Die Struktur ist: Situation, Fakten, Grund, naechster Schritt, Rueckfrage.`;
    case "B1":
      return `Im Modul ${definition.module.title} wird eine vertraute Situation genauer dargestellt. Die Lernenden erkennen Hauptpunkte, ordnen Details und formulieren eine zusammenhaengende Antwort. Dabei helfen klare Konnektoren, Beispiele und eine kurze Zusammenfassung, die zu ${definition.module.moduleEvidence} fuehrt.`;
    case "B2":
      return `Das Modul ${definition.module.title} verlangt eine begruendete Auswahl aus mehreren Informationen. Nicht jede Quelle ist gleich wichtig; die Lernenden muessen Argument, Beispiel, Einschraenkung und Register unterscheiden. Ziel ist eine strukturierte Antwort, die ${definition.module.moduleEvidence} nachvollziehbar macht.`;
    case "C1":
      return `Bei ${definition.module.title} steht nicht die Menge der Informationen im Vordergrund, sondern ihre Gewichtung. Eine angemessene Antwort trennt Bericht, Analyse und Bewertung, erkennt implizite Annahmen und passt die Formulierung an Zielgruppe, Genre und institutionellen Kontext an. So entsteht ${definition.module.moduleEvidence}.`;
    case "C2":
      return `In ${definition.module.title} muss die Antwort bewusst mit Mehrdeutigkeit, Konnotation und rhetorischer Wirkung umgehen. Entscheidend ist, ob die Lernenden eine dichte Vorlage so umformen koennen, dass Nuance erhalten bleibt, Handlungsoptionen sichtbar werden und ${definition.module.moduleEvidence} sprachlich souveraen wirkt.`;
  }
}

function guidedPromptFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  unit: UnitFocus,
  primaryPhrase: string
): string {
  return [
    `Guided ${unit.label.toLowerCase()} practice (about 10 minutes) for ${definition.module.title}:`,
    `1. Retrieval: say ${primaryPhrase} from memory, then check the model.`,
    `2. Complete: ${primaryPhrase} ___, weil ___.`,
    `3. Write a yes/no question and a W-question for this situation.`,
    `4. Select four usable words or chunks from: ${definition.module.vocabularyFocus}.`,
    `5. Put each selected item into a complete German sentence.`,
    `6. Transform one sentence so that it visibly uses ${definition.module.grammarFocus}.`,
    `7. Answer the receptive task: ${unit.inputTask}.`,
    `8. Read your answer aloud, focusing on ${definition.module.pronunciationFocus}.`,
    `9. Correct one grammar error and one unclear phrase.`,
    `10. Give the revised answer once more so it sounds ${profile.productionStyle}.`
  ].join("\n");
}

function guidedSolutionFor(definition: GermanCurriculumLessonDefinition, primaryPhrase: string): string {
  return [
    "Expected answers:",
    `A complete answer should keep the situation from ${definition.module.title}, include \`${primaryPhrase}\`, and add a clear reason with \`weil\` or a level-appropriate connector.`,
    `Vocabulary should come from ${definition.module.vocabularyFocus}.`,
    `Grammar should visibly connect to ${definition.module.grammarFocus}.`,
    "Accept different wording when the action, reason, and follow-up question are clear."
  ].join("\n");
}

function independentPromptFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): string {
  const prefix = isSublevelFinalAssessment(definition)
    ? "Sublevel final integrated assessment: "
    : "";

  return [
    `${prefix}Real-world goal: ${definition.module.moduleEvidence}.`,
    `Speaking task (8-10 minutes): Situation: you must ${definition.module.communicativePurpose}. Your role is the learner or customer; a partner, or your own recorded second voice, is the other person. Prepare the essential facts, open politely, complete at least six turns, ask two follow-up questions, repair one misunderstanding, and close with an agreed next step. Useful language: ${profile.phrases.join("; ")}.`,
    `Writing task (8-10 minutes): Write a recipient-ready text that supports the same goal. State the audience and purpose, include the situation, two relevant details, a reason, and the requested next action. Use ${definition.module.grammarFocus}. At ${definition.module.level}, aim for the length and complexity appropriate to ${profile.productionStyle}; clarity matters more than padding.`,
    `Mediation task (5 minutes, 60/90-minute route): Explain the important information to a person who did not see the source. ${profile.mediationStyle}. Preserve names, numbers, deadlines, conditions, and uncertainty. Do not translate sentence by sentence.`,
    `90-minute extension: add a second response with a different register, compare both versions, and explain three changes in tone, vocabulary, or sentence structure.`,
    `Evidence: record or rehearse the speaking response, save the written response, underline vocabulary for ${definition.module.vocabularyFocus}, and mark where you used ${definition.module.grammarFocus}.`
  ].join("\n");
}

function independentRubricFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): string {
  return [
    "Self-check rubric (0 = missing, 1 = partly, 2 = secure; target 8/10):",
    `1. Task completion: another person can act on the result for ${definition.module.moduleEvidence}.`,
    `2. Language control: the response visibly and accurately uses ${definition.module.grammarFocus}.`,
    `3. Vocabulary: at least four contextualized items from ${definition.module.vocabularyFocus}.`,
    `4. Interaction/register: the answer is ${profile.productionStyle} and includes an appropriate opening, repair, and closing.`,
    `5. Delivery/revision: pronunciation addresses ${definition.module.pronunciationFocus}, and the final version corrects at least two weaknesses.`,
    `Model response framework: ${profile.phrases[0]} ... . ${profile.phrases[1]} ... . ${profile.phrases[2]} ... . End with a clear next action or question. Different wording is valid when meaning, register, and task requirements are preserved.`
  ].join("\n");
}

function outcomesFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  unit: UnitFocus
): readonly string[] {
  return [
    `Understand the main situation in input about ${definition.module.communicativePurpose}.`,
    `Use vocabulary for ${definition.module.vocabularyFocus} in complete German phrases.`,
    `Control the session grammar focus: ${definition.module.grammarFocus}.`,
    `Produce a ${profile.productionStyle} response for ${unit.outputTask}.`,
    `Save evidence toward ${definition.module.moduleEvidence}.`
  ];
}

function relevanceFor(definition: GermanCurriculumLessonDefinition, profile: LevelProfile): string {
  return `This session turns ${definition.module.title.toLowerCase()} into usable learner evidence: ${definition.evidence}. At ${profile.label}, progress means handling the task with enough accuracy, repair, and detail that another person can act on the result.`;
}

function examplesFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  primaryPhrase: string,
  secondaryPhrase: string
): readonly string[] {
  return [
    `Core phrase: ${primaryPhrase} ${definition.module.moduleEvidence}.`,
    `Follow-up: ${secondaryPhrase} Welche Information fehlt noch?`,
    `Mini response: Ich habe die wichtigsten Punkte zu ${definition.module.title} notiert und kann den naechsten Schritt erklaeren.`,
    `Reason model: ${primaryPhrase} einen klaren naechsten Schritt, weil die andere Person danach handeln muss.`,
    `Repair model: Entschuldigung, das habe ich nicht ganz verstanden. Koennen Sie den letzten Punkt bitte anders formulieren?`,
    `Register model: informal answers may be shorter; formal answers need a greeting, clear request, reason, and polite closing. Aim for ${profile.productionStyle}.`
  ];
}

function commonMistakesFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile
): readonly string[] {
  return [
    `Collecting vocabulary for ${definition.module.vocabularyFocus} but not putting it into sentences.`,
    `Forgetting to show the grammar focus: ${definition.module.grammarFocus}.`,
    "Answering only in keywords when the task needs a clear action and reason.",
    profile.mistakes[0] ?? "Skipping revision after the first spoken or written attempt."
  ];
}

function knowledgeChecksFor(
  definition: GermanCurriculumLessonDefinition,
  profile: LevelProfile,
  unit: UnitFocus,
  primaryPhrase: string
): readonly Omit<LessonVersionEditorInput["knowledgeChecks"][number], "id">[] {
  return [
    {
      question: `What real-world action does this module prepare?`,
      answerKey: [definition.module.moduleEvidence],
      explanation: "The evidence task is the practical outcome the lesson is building toward."
    },
    {
      question: `Which grammar focus should appear in your answer?`,
      answerKey: [definition.module.grammarFocus],
      explanation: "The grammar focus should be visible in at least one corrected sentence."
    },
    {
      question: `Complete the phrase: ${primaryPhrase} ___, weil ___.`,
      answerKey: ["A complete answer adds an action and a reason."],
      explanation: "The answer may vary, but it must include a meaningful action and reason."
    },
    {
      question: `What should you check during ${unit.checkFocus}?`,
      answerKey: [definition.module.pronunciationFocus],
      explanation: `At ${profile.label}, delivery is part of the evidence, not an afterthought.`
    },
    {
      question: "What must a useful mediation preserve?",
      answerKey: ["The essential meaning, action, and important constraints for the target audience."],
      explanation: "Mediation restructures information for another person; it is not sentence-by-sentence translation."
    },
    {
      question: "How do you know the final production task is complete?",
      answerKey: ["The rubric reaches at least 8/10 and another person can understand or act on the result."],
      explanation: "A complete response combines task achievement, language control, vocabulary, register, and revision."
    }
  ];
}

function profileFor(level: GermanImplementedLevel): LevelProfile {
  if (level.startsWith("A1")) {
    return {
      cefrBand: "A1",
      label: `${level} supported beginner communication`,
      inputStyle: "very clear, short, repeated, and supported by English meaning where useful",
      productionStyle: "short, rehearsed, polite, and understandable",
      mediationStyle: "Relay one essential name, number, time, place, or action without adding information",
      phrases: [
        "Ich heisse",
        "Ich komme aus",
        "Ich moechte",
        "Koennen Sie das bitte wiederholen?",
        "Danke. Auf Wiedersehen."
      ],
      mistakes: ["Trying to translate English word order directly instead of keeping the conjugated verb in position two."]
    };
  }

  if (level.startsWith("A2")) {
    return {
      cefrBand: "A2",
      label: `${level} everyday independence`,
      inputStyle: "clear, practical, and close to everyday service encounters",
      productionStyle: "short, accurate, and understandable",
      mediationStyle: "Report only the needed facts in simple German or plain English before rewriting in German",
      phrases: [
        "Ich moechte wissen, ob",
        "Koennen Sie mir bitte sagen, wann",
        "Ich habe verstanden, dass",
        "Ich schlage vor, dass wir",
        "Meine Entscheidung ist"
      ],
      mistakes: ["Trying to write long B-level sentences before the A2 word order is stable."]
    };
  }

  if (level.startsWith("B1")) {
    return {
      cefrBand: "B1",
      label: `${level} independent threshold communication`,
      inputStyle: "connected, familiar, and detailed enough for independent decisions",
      productionStyle: "connected, clear, and supported with simple examples",
      mediationStyle: "Summarize the main point, the reason, and the requested action for someone who was not present",
      phrases: [
        "Meiner Meinung nach",
        "Ein wichtiger Grund ist, dass",
        "Zuerst ..., danach ...",
        "Ich wuerde empfehlen, dass",
        "Zusammenfassend kann man sagen"
      ],
      mistakes: ["Giving an opinion without an example or reason."]
    };
  }

  if (level.startsWith("B2")) {
    return {
      cefrBand: "B2",
      label: `${level} upper-intermediate argument and register control`,
      inputStyle: "authentic enough to include stance, limitation, and implied priority",
      productionStyle: "structured, register-aware, and supported by evidence",
      mediationStyle: "Condense the source, preserve nuance, and adapt the register for the listener",
      phrases: [
        "Einerseits ..., andererseits",
        "Aus den Informationen geht hervor, dass",
        "Daher waere es sinnvoll",
        "Im Vergleich dazu zeigt sich",
        "Ich halte diese Loesung fuer ueberzeugend, weil"
      ],
      mistakes: ["Listing arguments without showing how they are connected."]
    };
  }

  if (level.startsWith("C1")) {
    return {
      cefrBand: "C1",
      label: `${level} advanced precision, synthesis, and style`,
      inputStyle: "dense, implicit, and shaped by register or genre",
      productionStyle: "precise, cohesive, and adapted to audience and genre",
      mediationStyle: "Separate source meaning from your evaluation, then reformulate for the target audience",
      phrases: [
        "Es laesst sich argumentieren, dass",
        "Vor diesem Hintergrund",
        "Eine differenzierte Betrachtung zeigt",
        "Die zentrale Einschraenkung besteht darin, dass",
        "Ich wuerde die Aussage dahingehend praezisieren"
      ],
      mistakes: ["Sounding sophisticated while leaving the logical relationship unclear."]
    };
  }

  return {
    cefrBand: "C2",
    label: `${level} mastery, nuance, and rhetorical control`,
    inputStyle: "subtle, compressed, and open to more than one defensible interpretation",
    productionStyle: "highly precise, nuanced, rhetorically controlled, and genre-sensitive",
    mediationStyle: "Preserve ambiguity where it matters, clarify it where the target audience needs action",
    phrases: [
      "Bei genauer Betrachtung",
      "Die Formulierung ist bewusst ambivalent, weil",
      "Ich wuerde die Position nuancieren",
      "Entscheidend ist weniger ..., sondern vielmehr",
      "Die Pointe liegt darin, dass"
    ],
    mistakes: ["Flattening ambiguity instead of explaining why it matters."]
  };
}

function unitFocusFor(unitNumber: GermanUnitNumber): UnitFocus {
  switch (unitNumber) {
    case 1:
      return {
        label: "Core input and phrase control",
        inputTask: "identify the situation, speaker intention, and two useful phrases",
        outputTask: "a phrase bank plus five original German sentences",
        checkFocus: "the phrase-control pronunciation pass"
      };
    case 2:
      return {
        label: "Grammar in communicative context",
        inputTask: "find the grammar pattern and explain what it changes in meaning",
        outputTask: "a corrected paragraph that uses the grammar focus",
        checkFocus: "the grammar-readaloud pass"
      };
    case 3:
      return {
        label: "Listening, reading, and pronunciation detail",
        inputTask: "extract facts, stance, sequence, and one uncertain detail",
        outputTask: "a detail table, mediation summary, and pronunciation note",
        checkFocus: "the detail-and-delivery pass"
      };
    case 4:
      return {
        label: "Guided interaction and production",
        inputTask: "track the other speaker's need and choose a useful response",
        outputTask: "a role-play, written version, and self-review",
        checkFocus: "the interaction repair pass"
      };
    case 5:
      return {
        label: "Integrated real-world task",
        inputTask: "combine the module inputs into one action-ready response",
        outputTask: "the module evidence package with reflection",
        checkFocus: "the final evidence pass"
      };
  }
}

function phraseFor(profile: LevelProfile, unitNumber: GermanUnitNumber): string {
  return profile.phrases[unitNumber - 1] ?? profile.phrases[0] ?? "Ich kann die Aufgabe erklaeren";
}

function nextUnitNumber(unitNumber: GermanUnitNumber): GermanUnitNumber {
  return unitNumber === 5 ? 1 : ((unitNumber + 1) as GermanUnitNumber);
}

function isSublevelFinalAssessment(definition: GermanCurriculumLessonDefinition): boolean {
  return definition.module.moduleNumber === 10 && definition.unit.unitNumber === 5;
}
