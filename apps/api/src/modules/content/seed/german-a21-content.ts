import type { LessonVersionEditorInput } from "../domain/content.types.js";

type GermanA21Content = Pick<
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

interface GermanSeedLesson {
  readonly identifier: string;
  readonly evidence: string;
  readonly level?: string;
}

interface GermanActivity {
  readonly type:
    | "retrieval/review"
    | "explanation/input"
    | "vocabulary activity"
    | "grammar-in-context"
    | "listening"
    | "reading"
    | "pronunciation"
    | "controlled practice"
    | "guided production"
    | "independent production"
    | "speaking"
    | "writing"
    | "interaction"
    | "mediation"
    | "knowledge check"
    | "real-world task";
  readonly title: string;
  readonly minutes: number;
  readonly body: string;
}

interface GermanSession {
  readonly outcomes: readonly string[];
  readonly relevanceMarkdown: string;
  readonly activities: readonly GermanActivity[];
  readonly examples: readonly string[];
  readonly commonMistakes: readonly string[];
  readonly guidedPrompt: string;
  readonly guidedSolution: string;
  readonly independentPrompt: string;
  readonly knowledgeChecks: readonly Omit<LessonVersionEditorInput["knowledgeChecks"][number], "id">[];
}

export function germanA21ContentForLesson(lesson: GermanSeedLesson): GermanA21Content | null {
  const session = germanA21Sessions[lesson.identifier];

  if (session === undefined) {
    return null;
  }

  return {
    outcomes: session.outcomes,
    explanationMarkdown: renderSession(session),
    relevanceMarkdown: session.relevanceMarkdown,
    examples: session.examples,
    commonMistakes: session.commonMistakes,
    resources: [
      {
        title: "Practise German for free",
        provider: "Goethe-Institut",
        url: "https://www.goethe.de/en/spr/ueb.html",
        resourceType: "EXTRA_PRACTICE",
        difficulty: lesson.level ?? "A2.1",
        estimatedMinutes: 10,
        description:
          "Optional supplemental practice after the in-app lesson. The core explanation, examples, and exercises are already included here.",
        verificationStatus: "VERIFIED",
        required: false,
        approved: true,
        citation: "Goethe-Institut: Practise German for free"
      }
    ],
    exercises: [
      {
        kind: "guided",
        promptMarkdown: session.guidedPrompt,
        expectedEvidence: "Completed guided answers plus corrections from the answer notes.",
        solutionNotesMarkdown: session.guidedSolution
      },
      {
        kind: "independent",
        promptMarkdown: session.independentPrompt,
        expectedEvidence: lesson.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: session.knowledgeChecks
  };
}

function renderSession(session: GermanSession): string {
  return [
    "How to use this session with your available time:\n30 minutes: complete quick review, the first input activity, controlled practice, and the knowledge check.\n45 minutes: add pronunciation plus one speaking or writing task.\n60 minutes: complete the full main path through guided production. This should take about 55-65 active minutes.\n90 minutes: complete everything, including the extension production, mediation, and real-world task.",
    ...session.activities.map(
      (activity) => `${activity.title} (${activity.minutes} min)\n${activity.body}`
    )
  ].join("\n\n");
}

const germanA21Sessions: Record<string, GermanSession> = {
  "DE-A21-M01-S01": {
    outcomes: [
      "Ask for basic train and accommodation information for a short trip.",
      "Use travel words for departure, arrival, ticket, platform, and accommodation in complete phrases.",
      "Understand a short ticket-counter dialogue and identify destination, time, and price.",
      "Say train times and platform numbers clearly.",
      "Write a short travel information request."
    ],
    relevanceMarkdown:
      "A2.1 travel language is no longer just naming places. You need to ask for information, understand the answer, and keep enough detail to choose a real option.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: A1 travel building blocks",
        minutes: 5,
        body:
          "Say these aloud before reading the new material: `Ich moechte ...`, `Wie viel kostet das?`, `Wann?`, `Wo?`, `um acht Uhr`, `am Montag`, `mit dem Bus`. Then write one question with `Wann` and one with `Wo`."
      },
      {
        type: "vocabulary activity",
        title: "Travel phrases you can use today",
        minutes: 12,
        body:
          "Read each item, then say the German example aloud.\n\n`die Fahrkarte`, plural `die Fahrkarten` = ticket. Example: `Ich brauche eine Fahrkarte nach Leipzig.` Useful phrase: `eine Fahrkarte nach ...`\n`die Abfahrt`, plural `die Abfahrten` = departure. Example: `Die Abfahrt ist um 9:18 Uhr.` Useful phrase: `Wann ist die Abfahrt?`\n`die Ankunft`, plural `die Ankuenfte` = arrival. Example: `Die Ankunft ist um 11:42 Uhr.`\n`der Zug`, plural `die Zuege` = train. Example: `Der Zug faehrt von Gleis 4.`\n`das Gleis`, plural `die Gleise` = platform/track. Example: `Auf welchem Gleis faehrt der Zug?`\n`die Unterkunft`, plural `die Unterkuenfte` = accommodation. Example: `Ich suche eine Unterkunft fuer zwei Naechte.`\n`hin und zurueck` = return trip. Example: `Ich moechte eine Fahrkarte hin und zurueck.`"
      },
      {
        type: "explanation/input",
        title: "Core patterns: ask for travel information",
        minutes: 10,
        body:
          "Use `nach` for many city destinations: `nach Berlin`, `nach Leipzig`, `nach Wien`. Use `in` for countries with articles and many accommodation contexts: `in die Schweiz`, `im Hotel`, `in der Jugendherberge`. Use `mit` for transport: `mit dem Zug`, `mit dem Bus`.\n\nUseful question patterns:\n`Wann faehrt der Zug nach Dresden?`\n`Wie viel kostet die Fahrkarte?`\n`Auf welchem Gleis faehrt der Zug?`\n`Gibt es noch ein Zimmer fuer zwei Naechte?`\n`Ist die Unterkunft in der Naehe vom Bahnhof?`"
      },
      {
        type: "listening",
        title: "Listening script: at the ticket counter",
        minutes: 10,
        body:
          "Context: A learner asks at a ticket counter about a short trip. Speaker A is the learner. Speaker B works at the station.\n\nAudio script for later recording:\nA: Guten Tag. Ich moechte morgen nach Leipzig fahren.\nB: Einfach oder hin und zurueck?\nA: Hin und zurueck, bitte. Wann faehrt der naechste Zug?\nB: Um 9:18 Uhr. Die Ankunft in Leipzig ist um 10:35 Uhr.\nA: Von welchem Gleis faehrt der Zug?\nB: Von Gleis 7. Die Fahrkarte kostet 28 Euro.\nA: Danke. Ich nehme die Fahrkarte.\n\nFirst listen: Where does the learner want to go?\nSecond listen: Write the departure time, arrival time, platform, and price.\nAnswer key: Leipzig; 9:18; 10:35; Gleis 7; 28 Euro."
      },
      {
        type: "pronunciation",
        title: "Pronunciation: station numbers and weak endings",
        minutes: 6,
        body:
          "Say times in chunks: `neun Uhr achtzehn`, `zehn Uhr fuenfunddreissig`. Do not rush the second number. In words like `Fahrkarte`, `Abfahrt`, `Ankunft`, the final syllable may be lighter, but it must still be audible. Repeat aloud: `die Fahrkarte`, `die Abfahrt`, `die Ankunft`, `von Gleis sieben`, `achtundzwanzig Euro`."
      },
      {
        type: "controlled practice",
        title: "Controlled practice: build the request",
        minutes: 12,
        body:
          "Complete the sentences.\n1. Ich brauche eine Fahrkarte ______ Hamburg.\n2. Wann ______ der Zug?\n3. Die Abfahrt ist ______ 14:22 Uhr.\n4. Von welchem ______ faehrt der Zug?\n5. Ich suche eine Unterkunft ______ zwei Naechte.\n\nAnswer key: 1 nach, 2 faehrt, 3 um, 4 Gleis, 5 fuer."
      },
      {
        type: "writing",
        title: "Short writing: information request",
        minutes: 10,
        body:
          "Write a polite message to a tourist office or hotel. Include destination, date, number of nights, and one question. Model:\n`Guten Tag, ich moechte am Samstag nach Erfurt fahren. Ich suche eine Unterkunft fuer zwei Naechte. Gibt es ein Zimmer in der Naehe vom Bahnhof? Vielen Dank.`"
      },
      {
        type: "knowledge check",
        title: "Self-check",
        minutes: 5,
        body:
          "Without looking, write three travel questions: one with `Wann`, one with `Wie viel`, and one with `Auf welchem Gleis`. Then compare with the patterns above."
      }
    ],
    examples: [
      "A: Wann faehrt der Zug nach Leipzig?\nB: Der Zug faehrt um 9:18 Uhr von Gleis 7.",
      "Ich moechte eine Fahrkarte hin und zurueck.",
      "Ich suche eine Unterkunft fuer zwei Naechte in der Naehe vom Bahnhof."
    ],
    commonMistakes: [
      "Using `zu Berlin` instead of `nach Berlin` for city travel.",
      "Writing only isolated nouns instead of usable travel questions.",
      "Hearing the time but forgetting the platform or price.",
      "Saying long station numbers too fast to be understood."
    ],
    guidedPrompt:
      "Use the information to complete a ticket-counter dialogue.\n\nDestination: Leipzig\nDeparture: 9:18\nArrival: 10:35\nPlatform: 7\nPrice: 28 Euro\n\nA: Guten Tag. Ich moechte morgen ______ fahren.\nB: Einfach oder hin und zurueck?\nA: Hin und zurueck, bitte. Wann ______ der Zug?\nB: Um ______. Die Ankunft ist um ______.\nA: Von welchem ______ faehrt der Zug?\nB: Von ______. Die Fahrkarte kostet ______.\nA: Danke. Ich nehme die Fahrkarte.",
    guidedSolution:
      "Expected answers: `nach Leipzig`, `faehrt`, `9:18 Uhr`, `10:35 Uhr`, `Gleis`, `Gleis 7`, `28 Euro`. A good answer keeps the times, platform, and price accurate.",
    independentPrompt:
      "Plan a short trip to a German-speaking city. Write six lines: destination, travel date, departure question, arrival question, platform question, and accommodation question. Then say the questions aloud.",
    knowledgeChecks: [
      {
        question: "Which preposition usually goes with city travel: `nach Berlin` or `in Berlin` when you mean direction?",
        answerKey: ["nach Berlin"],
        explanation: "`nach` is the normal direction preposition for many city names."
      },
      {
        question: "What does `die Abfahrt` mean?",
        answerKey: ["departure"],
        explanation: "`Abfahrt` is the departure time or event."
      },
      {
        question: "Ask in German: From which platform does the train leave?",
        answerKey: ["Von welchem Gleis faehrt der Zug?"],
        explanation: "`Gleis` is platform/track; `faehrt` is the useful train verb here."
      }
    ]
  },
  "DE-A21-M01-S02": {
    outcomes: [
      "Recognize Perfekt forms in travel descriptions.",
      "Use `nach`, `in`, and `mit` accurately in controlled travel sentences.",
      "Use simple comparative chunks to compare two travel options.",
      "Write short sentences comparing train, bus, and accommodation choices.",
      "Avoid common A2 word-order errors in travel questions."
    ],
    relevanceMarkdown:
      "Travel decisions require more than one phrase. You need prepositions, comparison language, and recognition of past travel information so you can choose an option.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: travel request patterns",
        minutes: 5,
        body:
          "Write from memory: `eine Fahrkarte nach ...`, `mit dem Zug`, `um 9:18 Uhr`, `von Gleis 7`, `fuer zwei Naechte`. Then turn two of them into full sentences."
      },
      {
        type: "grammar-in-context",
        title: "Prepositions for travel: nach, in, mit",
        minutes: 12,
        body:
          "Use `nach` for direction to many cities and countries without an article: `nach Berlin`, `nach Oesterreich`, `nach Hause`. Use `in` for many places where you stay or enter: `ins Hotel`, `in die Jugendherberge`, `in der Naehe vom Bahnhof`. Use `mit` for transport and remember the dative article in common chunks: `mit dem Zug`, `mit dem Bus`, `mit der Bahn`.\n\nMini table:\nCity direction: `Ich fahre nach Koeln.`\nTransport: `Ich fahre mit dem Zug.`\nAccommodation: `Ich uebernachte im Hotel.`\nLocation: `Das Hotel ist in der Naehe vom Bahnhof.`"
      },
      {
        type: "grammar-in-context",
        title: "Perfekt recognition in travel texts",
        minutes: 10,
        body:
          "At A2.1 you do not need perfect tense mastery in every sentence, but you must recognize common travel Perfekt forms. Pattern: auxiliary + participle.\n\n`Ich habe die Fahrkarte gekauft.` = I bought the ticket.\n`Wir haben im Hotel uebernachtet.` = We stayed overnight in the hotel.\n`Der Zug ist um 9:18 Uhr abgefahren.` = The train departed at 9:18.\n\nNotice: movement/change often uses `sein` (`ist abgefahren`, `ist angekommen`). Many other actions use `haben` (`habe gekauft`, `haben gebucht`)."
      },
      {
        type: "explanation/input",
        title: "Comparative chunks for simple choices",
        minutes: 8,
        body:
          "Use these chunks before full comparative grammar is automatic:\n`Der Zug ist schneller als der Bus.`\n`Der Bus ist billiger als der Zug.`\n`Das Hotel ist naeher am Bahnhof.`\n`Option A ist besser fuer mich, weil ...`\n\nAt this level, one clear reason is enough."
      },
      {
        type: "controlled practice",
        title: "Controlled practice: choose the correct form",
        minutes: 12,
        body:
          "Choose the correct word.\n1. Ich fahre (nach / mit) Dresden.\n2. Ich fahre (nach / mit) dem Zug.\n3. Das Hotel ist (in / nach) der Naehe vom Bahnhof.\n4. Der Bus ist billiger (wie / als) der Zug.\n5. Der Zug (hat / ist) um 8:40 Uhr abgefahren.\n\nAnswer key: 1 nach, 2 mit, 3 in, 4 als, 5 ist."
      },
      {
        type: "reading",
        title: "Reading: two travel options",
        minutes: 10,
        body:
          "Read and mark price, time, and distance.\n\nOption A: Der Zug nach Weimar faehrt um 8:40 Uhr ab und kommt um 10:05 Uhr an. Die Fahrkarte kostet 24 Euro. Das Hotel ist 10 Minuten vom Bahnhof entfernt.\n\nOption B: Der Bus nach Weimar faehrt um 7:55 Uhr ab und kommt um 10:30 Uhr an. Die Fahrkarte kostet 14 Euro. Die Unterkunft ist 25 Minuten vom Bahnhof entfernt.\n\nQuestions: Which option is faster? Which is cheaper? Which accommodation is nearer? Answers: A is faster; B is cheaper; A is nearer."
      },
      {
        type: "writing",
        title: "Guided writing: compare two options",
        minutes: 10,
        body:
          "Write three comparison sentences from the reading. Use this frame:\n`Option __ ist schneller als Option __.`\n`Option __ ist billiger als Option __.`\n`Ich waehle Option __, weil __.`"
      }
    ],
    examples: [
      "Ich fahre nach Weimar mit dem Zug.",
      "Der Zug ist schneller als der Bus, aber der Bus ist billiger.",
      "Wir haben die Unterkunft gebucht. Sie ist in der Naehe vom Bahnhof."
    ],
    commonMistakes: [
      "Using `mit der Zug` instead of `mit dem Zug`.",
      "Using `wie` for unequal comparisons: say `schneller als`, not `schneller wie` in standard German.",
      "Treating every Perfekt sentence as productive grammar before recognizing the key meaning.",
      "Forgetting that a good choice sentence needs a reason."
    ],
    guidedPrompt:
      "Compare these options.\n\nA: Zug, 24 Euro, 1 hour 25 minutes, hotel 10 minutes from station.\nB: Bus, 14 Euro, 2 hours 35 minutes, accommodation 25 minutes from station.\n\nWrite five sentences using `nach`, `mit`, `schneller als`, `billiger als`, and `weil`.",
    guidedSolution:
      "Model answer: `Ich fahre nach Weimar. Option A ist mit dem Zug. Der Zug ist schneller als der Bus. Der Bus ist billiger als der Zug. Ich waehle Option A, weil das Hotel naeher am Bahnhof ist.` Other answers are acceptable if the comparison and reason are clear.",
    independentPrompt:
      "Choose two real or imaginary travel options. Write a short comparison with price, travel time, accommodation location, and your choice. Use at least one `als` sentence and one `weil` sentence.",
    knowledgeChecks: [
      {
        question: "Complete: `Ich fahre ___ Dresden.`",
        answerKey: ["nach"],
        explanation: "Use `nach` for direction to many city names."
      },
      {
        question: "Which is standard for unequal comparison: `schneller als` or `schneller wie`?",
        answerKey: ["schneller als"],
        explanation: "Use `als` for unequal comparisons in standard German."
      },
      {
        question: "In `Der Zug ist abgefahren`, what does the sentence tell you?",
        answerKey: ["The train departed."],
        explanation: "`ist ... abgefahren` is a Perfekt form of `abfahren`."
      }
    ]
  },
  "DE-A21-M01-S03": {
    outcomes: [
      "Extract times, platform numbers, prices, and restrictions from travel input.",
      "Read a short travel notice and identify the next useful action.",
      "Pronounce compound travel words and station numbers more clearly.",
      "Summarize one travel detail for another person.",
      "Use listening and reading details to prepare a booking choice."
    ],
    relevanceMarkdown:
      "A2.1 independence means you can act on short travel information. You do not need to understand every word, but you must capture the details that affect the trip.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: detail words",
        minutes: 5,
        body:
          "Write the German for departure, arrival, platform, ticket, and accommodation. Then say: `Der Zug faehrt um ... von Gleis ...` with any time and platform."
      },
      {
        type: "listening",
        title: "Listening script: platform change",
        minutes: 12,
        body:
          "Context: station announcement. Speaker: station announcer.\n\nAudio script for later recording:\nAchtung, eine Durchsage. Der Zug nach Nuernberg um 12:46 Uhr faehrt heute nicht von Gleis 3, sondern von Gleis 8. Die Abfahrt ist puenktlich. Reisende nach Nuernberg steigen bitte auf Gleis 8 ein.\n\nFirst listen: What changed?\nSecond listen: Write destination, time, old platform, new platform, and whether the train is late.\nAnswer key: Destination Nuernberg; time 12:46; old platform 3; new platform 8; not late / punctual."
      },
      {
        type: "reading",
        title: "Reading: booking notice",
        minutes: 12,
        body:
          "Read the notice.\n\nIhre Buchung: Reise nach Bamberg, Samstag, 18. Mai. Abfahrt 08:32 Uhr, Ankunft 10:14 Uhr. Sitzplatz: Wagen 6, Platz 42. Hinweis: Die Fahrkarte ist nur fuer diesen Zug gueltig. Das Hotel liegt 15 Minuten zu Fuss vom Bahnhof entfernt.\n\nTasks: Underline travel date, departure, arrival, seat, restriction, and hotel distance. Then answer: Can you use this ticket for any train? Answer: No, only for this train."
      },
      {
        type: "pronunciation",
        title: "Pronunciation: compounds and station numbers",
        minutes: 8,
        body:
          "Break compounds into meaningful parts: `Fahr-karte`, `Bahn-hof`, `Sitz-platz`, `Gleis-aenderung`. Say the stressed part clearly. Practise numbers in pairs: `zwoelf Uhr sechsundvierzig`, `Wagen sechs`, `Platz zweiundvierzig`, `Gleis acht`."
      },
      {
        type: "mediation",
        title: "Mediation: relay travel details",
        minutes: 8,
        body:
          "Your friend asks in English: `What changed?` Use simple English or German to relay the key action from the announcement: `The train to Nuernberg at 12:46 now leaves from platform 8, not platform 3. It is on time.`"
      },
      {
        type: "controlled practice",
        title: "Detail extraction practice",
        minutes: 10,
        body:
          "Read the sentence and write the action.\n1. `Der Zug faehrt heute von Gleis 8.` Action: go to ____.\n2. `Die Fahrkarte ist nur fuer diesen Zug gueltig.` Action: use only ____.\n3. `Das Hotel liegt 15 Minuten zu Fuss vom Bahnhof entfernt.` Action: walk about ____.\n\nAnswer key: 1 Gleis 8, 2 this train, 3 15 minutes."
      },
      {
        type: "speaking",
        title: "Speaking: report one travel detail",
        minutes: 8,
        body:
          "Situation: You listened to an announcement. Learner role: traveler helping a friend. Objective: report the most important change in one or two sentences. Support phrases: `Der Zug nach ... faehrt von Gleis ...`, `Die Abfahrt ist um ...`, `Der Zug ist puenktlich/verspaetet.` Expected duration: 30-45 seconds. Success criteria: destination, time, and action are clear."
      }
    ],
    examples: [
      "Der Zug nach Nuernberg faehrt heute von Gleis 8.",
      "Die Fahrkarte ist nur fuer diesen Zug gueltig.",
      "Das Hotel ist 15 Minuten zu Fuss vom Bahnhof entfernt."
    ],
    commonMistakes: [
      "Trying to translate every word before writing the action detail.",
      "Confusing old platform and new platform in an announcement.",
      "Ignoring restrictions like `nur fuer diesen Zug gueltig`.",
      "Saying long numbers without grouping them."
    ],
    guidedPrompt:
      "Use the announcement and notice from the lesson. Fill this travel note:\n\nZiel: ______\nAbfahrt: ______\nGleis: ______\nIst der Zug verspaetet? ______\nWichtige Regel fuer die Fahrkarte: ______\nHotel: ______ Minuten vom Bahnhof.",
    guidedSolution:
      "Expected from the two inputs: Nuernberg / 12:46 / Gleis 8 / nein, puenktlich / ticket only for this train / 15 minutes. If you used Bamberg details for the booking notice, keep those details internally consistent.",
    independentPrompt:
      "Create your own short travel notice with six details: destination, date, departure, arrival, platform or seat, and one restriction. Then write three comprehension questions with answer keys.",
    knowledgeChecks: [
      {
        question: "What does `Gleis 8` tell you?",
        answerKey: ["The platform/track is 8."],
        explanation: "`Gleis` is the station platform or track."
      },
      {
        question: "What action follows from `nicht von Gleis 3, sondern von Gleis 8`?",
        answerKey: ["Go to platform 8, not platform 3."],
        explanation: "`sondern` corrects the first information."
      },
      {
        question: "What does `nur fuer diesen Zug gueltig` mean?",
        answerKey: ["Only valid for this train."],
        explanation: "This is a practical restriction."
      }
    ]
  },
  "DE-A21-M01-S04": {
    outcomes: [
      "Ask and answer travel-option questions in a guided exchange.",
      "Compare two options using price, time, and location.",
      "Draft a booking message with the necessary details.",
      "Repair misunderstandings politely during a travel conversation.",
      "Prepare spoken evidence for a travel decision."
    ],
    relevanceMarkdown:
      "This session moves from recognizing travel details to using them in an exchange. The goal is a short, useful conversation, not a perfect tourist-office performance.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: comparison and booking chunks",
        minutes: 6,
        body:
          "Say aloud: `Der Zug ist schneller als der Bus. Der Bus ist billiger. Das Hotel ist naeher am Bahnhof. Ich waehle Option A, weil ...` Then write one question about price and one about accommodation."
      },
      {
        type: "interaction",
        title: "Role-play setup: two options",
        minutes: 10,
        body:
          "Option A: train to Regensburg, departure 08:20, arrival 10:10, ticket 26 Euro, hotel 8 minutes from station.\nOption B: bus to Regensburg, departure 07:45, arrival 10:35, ticket 13 Euro, hostel 20 minutes from station.\n\nLearner role: traveler. Partner role: station or tourist-office employee. Objective: ask about both options and choose one."
      },
      {
        type: "speaking",
        title: "Speaking support phrases",
        minutes: 8,
        body:
          "Use these phrases during the role-play:\n`Ich moechte nach Regensburg fahren.`\n`Wann ist die Abfahrt?`\n`Wie lange dauert die Fahrt?`\n`Wie viel kostet die Fahrkarte?`\n`Ist die Unterkunft in der Naehe vom Bahnhof?`\n`Koennen Sie das bitte wiederholen?`\n`Ich nehme Option ..., weil ...`"
      },
      {
        type: "guided production",
        title: "Guided dialogue",
        minutes: 15,
        body:
          "Complete and speak the dialogue.\nA: Guten Tag. Ich moechte nach Regensburg fahren.\nB: Mit dem Zug oder mit dem Bus?\nA: Was ist schneller?\nB: Der Zug ist schneller. Er kommt um 10:10 Uhr an.\nA: Und was ist billiger?\nB: Der Bus ist billiger. Er kostet 13 Euro.\nA: Ich nehme den Zug, weil ______.\nB: Gut. Die Fahrkarte kostet ______.\n\nPossible answers: `das Hotel naeher am Bahnhof ist`; `26 Euro`."
      },
      {
        type: "writing",
        title: "Booking message",
        minutes: 12,
        body:
          "Write a booking message. Include city, date, transport choice, arrival time, accommodation need, and one polite question. Model:\n`Guten Tag, ich moechte am 18. Mai nach Regensburg fahren. Ich komme um 10:10 Uhr an und suche ein Zimmer fuer zwei Naechte. Haben Sie ein Zimmer in der Naehe vom Bahnhof? Vielen Dank.`"
      },
      {
        type: "independent production",
        title: "Self-study speaking alternative",
        minutes: 10,
        body:
          "If you do not have a partner, record or rehearse both roles. First read the employee answers. Then cover them and answer as the traveler. Success criteria: you ask three clear questions, choose one option, and give one reason."
      },
      {
        type: "knowledge check",
        title: "Self-check: repair",
        minutes: 5,
        body:
          "Write two polite repair phrases from memory. Model answers: `Noch einmal, bitte.` `Koennen Sie das bitte wiederholen?` `Langsamer, bitte.`"
      }
    ],
    examples: [
      "A: Was ist schneller?\nB: Der Zug ist schneller als der Bus.",
      "Ich nehme den Zug, weil das Hotel naeher am Bahnhof ist.",
      "Koennen Sie das bitte wiederholen?"
    ],
    commonMistakes: [
      "Choosing an option without saying why.",
      "Using only English repair phrases when German repair phrases are already available.",
      "Comparing too many details and losing the main task.",
      "Writing a booking message without date or number of nights."
    ],
    guidedPrompt:
      "Use Option A and B from the lesson. Write a 6-turn dialogue. Required items: destination, price question, time question, accommodation question, one repair phrase, final choice with `weil`.",
    guidedSolution:
      "A complete answer includes six turns and these functions: ask destination/travel, ask price, ask time, ask accommodation, repair, choose with reason. Grammar can be simple if the task is complete.",
    independentPrompt:
      "Create a new pair of travel options for another city. Speak for 60-90 seconds or write 100-120 words comparing them. End with `Ich waehle ..., weil ...`.",
    knowledgeChecks: [
      {
        question: "Which phrase politely asks someone to repeat?",
        answerKey: ["Koennen Sie das bitte wiederholen?", "Noch einmal, bitte."],
        explanation: "Both are useful repair phrases; the first is more complete and polite."
      },
      {
        question: "Complete: `Ich nehme den Zug, weil das Hotel naeher am Bahnhof ___.`",
        answerKey: ["ist"],
        explanation: "With `weil`, the conjugated verb goes to the end."
      },
      {
        question: "What three details should a booking message include?",
        answerKey: ["Date, number of nights, and accommodation request.", "City, date, and accommodation need."],
        explanation: "A real booking message needs enough information for the other person to act."
      }
    ]
  },
  "DE-A21-M01-S05": {
    outcomes: [
      "Complete an integrated travel task using two options.",
      "Understand the key details in a short travel input.",
      "Write a booking or inquiry message with a clear choice.",
      "Relay essential travel information to another person.",
      "Check your own output against A2.1 travel-task criteria."
    ],
    relevanceMarkdown:
      "This is the module task. It proves that travel vocabulary, prepositions, comparison, listening, reading, and polite requests can work together in one realistic decision.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: before the task",
        minutes: 6,
        body:
          "Write from memory: three travel nouns, two preposition phrases, two comparison phrases, and one repair phrase. Check them against earlier sessions before starting the task."
      },
      {
        type: "listening",
        title: "Task input 1: voicemail script",
        minutes: 10,
        body:
          "Context: A friend leaves a voicemail about travel preferences.\n\nAudio script for later recording:\nHallo, ich kann am Freitag reisen. Ich moechte nicht zu spaet ankommen, weil ich am Abend einen Termin habe. Der Zug ist vielleicht besser als der Bus. Aber bitte achte auch auf den Preis. Ich brauche ausserdem eine Unterkunft in der Naehe vom Bahnhof.\n\nQuestions: Which day? What is important: arrival time, price, or accommodation? Answer: Friday; all three matter, especially not arriving too late and being near the station."
      },
      {
        type: "reading",
        title: "Task input 2: two options",
        minutes: 12,
        body:
          "Option A: Zug nach Wuerzburg. Abfahrt Freitag 09:12, Ankunft 11:05. Preis: 31 Euro. Hotel: 9 Minuten zu Fuss vom Bahnhof.\n\nOption B: Bus nach Wuerzburg. Abfahrt Freitag 08:30, Ankunft 12:20. Preis: 16 Euro. Pension: 28 Minuten mit der Strassenbahn vom Bahnhof.\n\nMark the better option for your friend and write why."
      },
      {
        type: "real-world task",
        title: "Choose and book",
        minutes: 18,
        body:
          "Write a message in German to your friend or to the accommodation provider. Required content: destination, chosen option, departure, arrival, price, accommodation location, and one reason with `weil`.\n\nUseful frame:\n`Ich waehle Option __. Der Zug/Bus faehrt um __ und kommt um __ an. Die Fahrkarte kostet __ Euro. Die Unterkunft ist __. Ich waehle diese Option, weil __.`"
      },
      {
        type: "mediation",
        title: "Relay the decision in English or simple German",
        minutes: 8,
        body:
          "Imagine your friend does not have time to read the details. Relay the decision in two or three sentences. Include the chosen option, arrival time, price, and accommodation distance."
      },
      {
        type: "speaking",
        title: "Spoken confirmation",
        minutes: 8,
        body:
          "Speak your decision aloud. Expected duration: 45-60 seconds. Success criteria: your listener can answer where, when, how much, where the accommodation is, and why you chose it."
      },
      {
        type: "knowledge check",
        title: "Module task checklist",
        minutes: 5,
        body:
          "Check your task evidence: Did you include destination, departure, arrival, price, accommodation, comparison, and a reason? Did you use at least one `nach`, one `mit`, and one `weil` sentence?"
      }
    ],
    examples: [
      "Ich waehle Option A, weil der Zug frueher ankommt.",
      "Die Fahrkarte kostet 31 Euro, aber das Hotel ist nur 9 Minuten vom Bahnhof entfernt.",
      "For my friend: The train option is better because it arrives at 11:05 and the hotel is close to the station."
    ],
    commonMistakes: [
      "Choosing the cheaper option while ignoring the friend needs to arrive early.",
      "Forgetting to include accommodation distance.",
      "Writing `weil der Zug kommt frueher an` instead of `weil der Zug frueher ankommt`.",
      "Giving a decision without evidence from the input."
    ],
    guidedPrompt:
      "Complete the decision note using Option A.\n\nIch waehle Option __. Der Zug faehrt um __ und kommt um __ an. Die Fahrkarte kostet __. Das Hotel ist __ Minuten vom Bahnhof entfernt. Ich waehle Option __, weil der Zug __.",
    guidedSolution:
      "Model answer: `Ich waehle Option A. Der Zug faehrt um 09:12 und kommt um 11:05 an. Die Fahrkarte kostet 31 Euro. Das Hotel ist 9 Minuten vom Bahnhof entfernt. Ich waehle Option A, weil der Zug frueher ankommt.`",
    independentPrompt:
      "Complete the full module task with your own final decision. Write 100-120 words or record 60 seconds. Include one mediation summary for your friend in English or simple German.",
    knowledgeChecks: [
      {
        question: "Which option better matches a friend who must not arrive too late?",
        answerKey: ["Option A", "the train option"],
        explanation: "Option A arrives at 11:05; Option B arrives at 12:20."
      },
      {
        question: "Correct the word order: `weil der Zug kommt frueher an`.",
        answerKey: ["weil der Zug frueher ankommt"],
        explanation: "In a `weil` clause, the conjugated verb goes to the end; separable prefix and verb join at the end."
      },
      {
        question: "What does your mediation summary need to preserve?",
        answerKey: ["Chosen option, arrival time, price, accommodation location, and reason."],
        explanation: "Mediation keeps the details another person needs for action."
      }
    ]
  },
  "DE-A21-M02-S01": {
    outcomes: [
      "Recognize and use core phrases for changing a plan.",
      "Give a simple reason for a delay or change.",
      "Write a polite apology and alternative suggestion.",
      "Understand a short plan-change dialogue.",
      "Choose a tone that fits a friend or service contact."
    ],
    relevanceMarkdown:
      "Plans change constantly. A2.1 learners need enough language to apologize, explain the reason, and offer a realistic alternative without sounding abrupt.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: travel decision language",
        minutes: 5,
        body:
          "Write two sentences from the travel module: one with `Ich waehle ...` and one with `weil`. Then say one travel time aloud."
      },
      {
        type: "vocabulary activity",
        title: "Plan-change phrases",
        minutes: 12,
        body:
          "`Leider` = unfortunately. Example: `Leider komme ich spaeter.`\n`Ich habe Verspaetung.` = I am delayed. Useful phrase: `Ich habe 20 Minuten Verspaetung.`\n`Ich kann nicht kommen.` = I cannot come.\n`Es tut mir leid.` = I am sorry.\n`Koennen wir den Termin verschieben?` = Can we move/reschedule the appointment?\n`Passt dir/Sie ...?` = Does ... work for you? Informal: `Passt dir 15 Uhr?` Formal: `Passt Ihnen 15 Uhr?`\n`Ich schlage ... vor.` = I suggest ... Example: `Ich schlage 16 Uhr vor.`"
      },
      {
        type: "explanation/input",
        title: "Message structure: apology, reason, alternative",
        minutes: 10,
        body:
          "A useful A2.1 plan-change message has three parts.\n1. Apology or signal: `Es tut mir leid, aber ...` / `Leider ...`\n2. Reason: `weil mein Zug Verspaetung hat` / `weil ich arbeiten muss`\n3. Alternative: `Koennen wir uns um 16 Uhr treffen?` / `Passt dir morgen?`\n\nFriend tone: `Hallo Mia, es tut mir leid ... Passt dir ...?`\nFormal tone: `Guten Tag, es tut mir leid ... Passt Ihnen ...?`"
      },
      {
        type: "listening",
        title: "Listening script: delayed arrival",
        minutes: 10,
        body:
          "Context: phone message to a friend.\n\nAudio script for later recording:\nHallo Ben, ich bin noch im Zug. Leider hat mein Zug 25 Minuten Verspaetung. Ich komme nicht um 14 Uhr, sondern um 14:30 Uhr. Es tut mir leid. Passt dir das noch?\n\nFirst listen: Is the speaker cancelling or arriving later?\nSecond listen: Write original time, new time, reason, and apology phrase.\nAnswer key: arriving later; 14:00; 14:30; train is 25 minutes late; `Es tut mir leid.`"
      },
      {
        type: "controlled practice",
        title: "Controlled practice: complete the message",
        minutes: 10,
        body:
          "Complete.\n1. ______ komme ich spaeter. (Unfortunately)\n2. Mein Zug hat 20 Minuten ______. (delay)\n3. Es tut mir ______. (sorry)\n4. Koennen wir den Termin ______? (move/reschedule)\n5. Passt ______ 16 Uhr? (informal you)\n\nAnswer key: 1 Leider, 2 Verspaetung, 3 leid, 4 verschieben, 5 dir."
      },
      {
        type: "writing",
        title: "Write a short plan-change note",
        minutes: 10,
        body:
          "Write a message to a friend. You are 20 minutes late because the bus is late. Suggest a new time. Use this frame:\n`Hallo __, leider __. Mein Bus __. Ich komme um __. Es tut mir leid. Passt dir das?`"
      },
      {
        type: "pronunciation",
        title: "Pronunciation: apology intonation",
        minutes: 5,
        body:
          "Say apology phrases with a falling, calm voice, not a sharp command voice: `Es tut mir leid.` `Leider komme ich spaeter.` `Koennen wir den Termin verschieben?` Repeat each twice."
      }
    ],
    examples: [
      "Leider hat mein Zug Verspaetung.",
      "Es tut mir leid. Koennen wir uns um 16 Uhr treffen?",
      "Guten Tag, ich kann heute leider nicht kommen. Passt Ihnen morgen um 10 Uhr?"
    ],
    commonMistakes: [
      "Only saying `Ich kann nicht` without apology or alternative.",
      "Using informal `dir` in a formal message.",
      "Forgetting the concrete new time.",
      "Giving a reason but no action for the other person."
    ],
    guidedPrompt:
      "Write a message from the facts.\n\nPerson: friend\nProblem: bus is late\nOriginal time: 15:00\nNew time: 15:30\nReason: bus has 30 minutes delay\n\nUse: `leider`, `Verspaetung`, `Es tut mir leid`, `Passt dir ...?`",
    guidedSolution:
      "Model answer: `Hallo, leider hat mein Bus 30 Minuten Verspaetung. Ich komme nicht um 15 Uhr, sondern um 15:30 Uhr. Es tut mir leid. Passt dir das noch?`",
    independentPrompt:
      "Write two plan-change messages: one to a friend and one formal message to a course office. Each must include apology, reason, new suggestion, and a question.",
    knowledgeChecks: [
      {
        question: "What does `Leider` mean in a plan-change message?",
        answerKey: ["unfortunately"],
        explanation: "`Leider` signals bad news politely."
      },
      {
        question: "Which is informal: `Passt dir 16 Uhr?` or `Passt Ihnen 16 Uhr?`",
        answerKey: ["Passt dir 16 Uhr?"],
        explanation: "`dir` is informal; `Ihnen` is formal."
      },
      {
        question: "Name the three parts of a useful plan-change message.",
        answerKey: ["Apology/signal, reason, alternative."],
        explanation: "This structure gives the other person enough information to respond."
      }
    ]
  },
  "DE-A21-M02-S02": {
    outcomes: [
      "Use `weil` clauses with verb-final word order in plan-change messages.",
      "Review modal verbs for availability and necessity.",
      "Use common Perfekt-with-haben forms to explain what happened.",
      "Transform short reason sentences into connected messages.",
      "Correct common `weil` word-order mistakes."
    ],
    relevanceMarkdown:
      "Giving a reason makes a changed plan easier to accept. `weil` is one of the most useful A2 connectors, but it changes word order.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: apology and alternative",
        minutes: 5,
        body:
          "Write: `Leider ...`, `Es tut mir leid`, and one alternative question. Then add one reason in English before learning the German structure."
      },
      {
        type: "grammar-in-context",
        title: "Weil clauses: verb at the end",
        minutes: 15,
        body:
          "`weil` means because. In a `weil` clause, the conjugated verb moves to the end.\n\nMain clause: `Ich komme spaeter.`\nReason: `Mein Zug hat Verspaetung.`\nConnected: `Ich komme spaeter, weil mein Zug Verspaetung hat.`\n\nMain clause: `Ich kann nicht kommen.`\nReason: `Ich muss arbeiten.`\nConnected: `Ich kann nicht kommen, weil ich arbeiten muss.`\n\nMain clause: `Wir verschieben den Termin.`\nReason: `Sara ist krank.`\nConnected: `Wir verschieben den Termin, weil Sara krank ist.`"
      },
      {
        type: "grammar-in-context",
        title: "Modal review for plan changes",
        minutes: 8,
        body:
          "Modal verbs often stand at the end with an infinitive in the main clause: `Ich muss arbeiten.` `Ich kann heute nicht kommen.` `Wir koennen uns morgen treffen.` In a `weil` clause, the modal moves to the end after the infinitive: `weil ich arbeiten muss`, `weil ich heute nicht kommen kann`."
      },
      {
        type: "grammar-in-context",
        title: "Perfekt with haben for reasons",
        minutes: 8,
        body:
          "Use Perfekt with `haben` for completed events that explain the change:\n`Ich habe den Zug verpasst.` = I missed the train.\n`Ich habe den Termin vergessen.` = I forgot the appointment.\n`Ich habe eine Nachricht bekommen.` = I received a message.\n\nConnected: `Ich komme spaeter, weil ich den Zug verpasst habe.`"
      },
      {
        type: "controlled practice",
        title: "Controlled practice: move the verb",
        minutes: 12,
        body:
          "Combine with `weil`.\n1. Ich komme spaeter. Mein Zug hat Verspaetung.\n2. Ich kann nicht kommen. Ich muss arbeiten.\n3. Wir treffen uns morgen. Ich habe heute keine Zeit.\n4. Ich schreibe eine Nachricht. Ich habe den Termin vergessen.\n\nAnswer key:\n1. Ich komme spaeter, weil mein Zug Verspaetung hat.\n2. Ich kann nicht kommen, weil ich arbeiten muss.\n3. Wir treffen uns morgen, weil ich heute keine Zeit habe.\n4. Ich schreibe eine Nachricht, weil ich den Termin vergessen habe."
      },
      {
        type: "pronunciation",
        title: "Pronunciation: clause-final verb rhythm",
        minutes: 6,
        body:
          "Read the whole reason as one rhythm group and land clearly on the final verb: `weil mein Zug Verspaetung HAT`, `weil ich arbeiten MUSS`, `weil ich den Zug verpasst HABE`."
      },
      {
        type: "writing",
        title: "Guided writing: explain the reason",
        minutes: 10,
        body:
          "Write three plan-change sentences. Use one reason with `hat`, one with a modal verb, and one with Perfekt: `..., weil ... hat/muss/habe`."
      }
    ],
    examples: [
      "Ich komme spaeter, weil mein Zug Verspaetung hat.",
      "Ich kann heute nicht kommen, weil ich arbeiten muss.",
      "Es tut mir leid, weil ich den Termin vergessen habe."
    ],
    commonMistakes: [
      "Writing `weil mein Zug hat Verspaetung` instead of `weil mein Zug Verspaetung hat`.",
      "Forgetting the infinitive before the modal: `weil ich arbeiten muss`.",
      "Using Perfekt participles without the auxiliary: `ich den Zug verpasst`.",
      "Making the reason so long that the main message becomes unclear."
    ],
    guidedPrompt:
      "Correct the messages.\n1. Ich komme spaeter, weil mein Zug hat Verspaetung.\n2. Ich kann nicht kommen, weil ich muss arbeiten.\n3. Es tut mir leid, weil ich den Zug verpasst.\n4. Wir treffen uns morgen, weil ich habe heute keine Zeit.",
    guidedSolution:
      "Corrections: 1 `weil mein Zug Verspaetung hat`; 2 `weil ich arbeiten muss`; 3 `weil ich den Zug verpasst habe`; 4 `weil ich heute keine Zeit habe`.",
    independentPrompt:
      "Write a 70-90 word message changing a plan. Include one `weil` clause with a modal verb and one Perfekt reason with `haben`.",
    knowledgeChecks: [
      {
        question: "Where does the conjugated verb go in a `weil` clause?",
        answerKey: ["At the end."],
        explanation: "`weil` sends the conjugated verb to the end of the subordinate clause."
      },
      {
        question: "Correct: `weil ich muss arbeiten`.",
        answerKey: ["weil ich arbeiten muss"],
        explanation: "The infinitive `arbeiten` comes before the final modal `muss`."
      },
      {
        question: "Complete: `weil ich den Zug verpasst ____.`",
        answerKey: ["habe"],
        explanation: "`verpasst habe` is Perfekt with `haben`."
      }
    ]
  },
  "DE-A21-M02-S03": {
    outcomes: [
      "Understand short spoken and written plan changes.",
      "Identify original plan, problem, reason, and new suggestion.",
      "Use polite apology intonation and clause-final rhythm.",
      "Summarize a plan change for another person.",
      "Prepare a practical reply to a changed arrangement."
    ],
    relevanceMarkdown:
      "When someone changes a plan, the important task is not grammar analysis. You need to understand what changed, why, and what you should do next.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: reason structures",
        minutes: 5,
        body:
          "Write two `weil` clauses from memory: one ending in `hat` and one ending in `muss`. Say both aloud with the final verb clear."
      },
      {
        type: "listening",
        title: "Listening script: appointment change",
        minutes: 12,
        body:
          "Context: voicemail from a course partner.\n\nAudio script for later recording:\nHallo Samira, hier ist Leo. Es tut mir leid, aber ich kann heute nicht um 17 Uhr lernen, weil ich laenger arbeiten muss. Koennen wir uns um 18:30 Uhr online treffen? Ich habe die Aufgabe schon gelesen. Schreib mir bitte kurz. Danke!\n\nFirst listen: What is the new suggested time?\nSecond listen: Write original time, reason, meeting format, and what Leo already did.\nAnswer key: 18:30; original 17:00; he must work longer; online; he has already read the task."
      },
      {
        type: "reading",
        title: "Reading: three short messages",
        minutes: 12,
        body:
          "Read the messages and identify action needed.\n\n1. `Hallo, ich habe den Bus verpasst. Ich komme 20 Minuten spaeter. Warte bitte im Cafe.`\n2. `Guten Tag, leider muss ich den Termin verschieben, weil ich krank bin. Passt Ihnen Donnerstag um 10 Uhr?`\n3. `Ich kann morgen doch kommen. Der Termin um 14 Uhr passt. Bis morgen!`\n\nActions: 1 wait in the cafe; 2 answer whether Thursday 10 works; 3 no change needed, meeting tomorrow at 14 works."
      },
      {
        type: "pronunciation",
        title: "Pronunciation: apology and final verbs",
        minutes: 7,
        body:
          "Repeat with calm intonation: `Es tut mir leid, aber ...` Then mark the final verb in each reason: `weil ich laenger arbeiten MUSS`, `weil ich krank BIN`, `weil ich den Bus verpasst HABE`."
      },
      {
        type: "mediation",
        title: "Mediation: tell a partner what changed",
        minutes: 8,
        body:
          "Use this frame in English or simple German: `Leo cannot meet at 17:00 because he has to work longer. He suggests 18:30 online. He has already read the task.` Keep time, reason, new plan, and completed action."
      },
      {
        type: "controlled practice",
        title: "Detail table",
        minutes: 8,
        body:
          "For each message, write four columns: old plan, reason, new plan, action for me. If a detail is not given, write `not given` instead of guessing."
      },
      {
        type: "writing",
        title: "Reply to the message",
        minutes: 8,
        body:
          "Write a reply to Leo. Accept or reject the new time and give one short reason. Use one of these starts: `18:30 passt gut.` / `Leider passt 18:30 nicht, weil ...`"
      }
    ],
    examples: [
      "18:30 passt gut. Bis spaeter online!",
      "Leider passt Donnerstag nicht, weil ich arbeiten muss.",
      "Leo kann nicht um 17 Uhr lernen. Er schlaegt 18:30 Uhr vor."
    ],
    commonMistakes: [
      "Answering only the apology and missing the new suggested time.",
      "Inventing a reason that was not in the message.",
      "Confusing `doch kommen` with cancellation.",
      "Speaking the final verb too softly in a `weil` clause."
    ],
    guidedPrompt:
      "From Leo's voicemail, complete the summary.\n\nLeo kann nicht um ______ lernen, weil er ______. Er schlaegt ______ Uhr ______ vor. Er hat die Aufgabe schon ______. Samira soll kurz ______.",
    guidedSolution:
      "Expected: `17 Uhr`; `laenger arbeiten muss`; `18:30`; `online`; `gelesen`; `schreiben`. Minor wording differences are fine if the facts are preserved.",
    independentPrompt:
      "Write your own plan-change voicemail script of 70-90 words. Then write four comprehension questions and an answer key.",
    knowledgeChecks: [
      {
        question: "In Leo's voicemail, why can he not meet at 17:00?",
        answerKey: ["Because he has to work longer.", "weil er laenger arbeiten muss"],
        explanation: "The reason is in the `weil` clause."
      },
      {
        question: "What should you preserve when mediating a plan change?",
        answerKey: ["Old plan, reason, new plan, and action needed."],
        explanation: "These details let the other person act."
      },
      {
        question: "What does `Ich kann morgen doch kommen` mean in context?",
        answerKey: ["I can come tomorrow after all."],
        explanation: "`doch` can reverse an earlier negative expectation."
      }
    ]
  },
  "DE-A21-M02-S04": {
    outcomes: [
      "Handle a guided conversation about changing a plan.",
      "Use polite repair and alternative suggestions.",
      "Write a practical plan-change message with reason and new time.",
      "Use `weil` word order in spoken and written production.",
      "Complete self-study speaking practice without a partner."
    ],
    relevanceMarkdown:
      "This is the production bridge before the module task. You practise controlling the conversation so the other person knows what changed and what option you suggest.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: message formula",
        minutes: 5,
        body:
          "Write the formula: apology/signal + reason + alternative. Then write one sentence beginning `Leider ...` and one beginning `Koennen wir ...?`"
      },
      {
        type: "interaction",
        title: "Situation: change a study meeting",
        minutes: 10,
        body:
          "Situation: You planned to meet a study partner at 16:00. Your train is late and you can arrive at 16:45. Learner role: person changing the plan. Partner role: study partner. Objective: apologize, explain, suggest new time, and confirm."
      },
      {
        type: "speaking",
        title: "Phrase bank for the role-play",
        minutes: 8,
        body:
          "`Es tut mir leid, aber ...`\n`Mein Zug hat Verspaetung.`\n`Ich komme um 16:45 Uhr.`\n`Koennen wir uns spaeter treffen?`\n`Passt dir 16:45 Uhr?`\n`Danke fuer dein Verstaendnis.`\nRepair: `Kannst du das bitte wiederholen?` / `Meinst du 16:15 oder 16:45?`"
      },
      {
        type: "guided production",
        title: "Guided role-play",
        minutes: 15,
        body:
          "Complete the turns, then speak both roles.\nA: Hallo, es tut mir leid, aber ich komme spaeter.\nB: Warum?\nA: Weil mein Zug ______.\nB: Wann kommst du?\nA: Ich komme um ______. Passt dir das?\nB: Ja, das passt. Treffen wir uns im Cafe?\nA: Ja, danke. Bis spaeter.\n\nPossible answers: `Verspaetung hat`; `16:45 Uhr`."
      },
      {
        type: "writing",
        title: "Write the message version",
        minutes: 12,
        body:
          "Write the same situation as a short text message. Include: greeting, apology, reason with `weil`, new time, confirmation question, thanks."
      },
      {
        type: "independent production",
        title: "Self-study speaking alternative",
        minutes: 10,
        body:
          "If you are alone, record a 45-60 second voice message. Use the phrase bank, then listen once and check: Did you include apology, reason, new time, and question?"
      },
      {
        type: "controlled practice",
        title: "Repair practice",
        minutes: 6,
        body:
          "Choose the repair phrase.\n1. You did not hear the time: `Kannst du das bitte wiederholen?`\n2. You are unsure between two times: `Meinst du 16:15 oder 16:45?`\n3. You need slower speech: `Langsamer, bitte.`"
      }
    ],
    examples: [
      "Es tut mir leid, aber ich komme spaeter, weil mein Zug Verspaetung hat.",
      "Passt dir 16:45 Uhr?",
      "Meinst du 16:15 oder 16:45?"
    ],
    commonMistakes: [
      "Leaving out the confirmation question.",
      "Saying the reason without `weil` practice when this session requires it.",
      "Using a formal message style with a close friend every time.",
      "Not checking whether the other person accepted the new time."
    ],
    guidedPrompt:
      "Write a complete 6-turn dialogue for this situation: You planned 16:00, your train is 45 minutes late, you suggest 16:45 at a cafe. Include one repair phrase from the lesson.",
    guidedSolution:
      "A complete dialogue should include apology, reason, new time, acceptance or rejection, location confirmation, and one repair phrase. Model reason: `weil mein Zug 45 Minuten Verspaetung hat`.",
    independentPrompt:
      "Write or record a new plan-change conversation. Change the reason and relationship: friend, course office, or hotel. Use the correct `dir` or `Ihnen` form.",
    knowledgeChecks: [
      {
        question: "What question checks whether the new time works informally?",
        answerKey: ["Passt dir ...?", "Passt dir 16:45 Uhr?"],
        explanation: "`dir` is the informal dative form."
      },
      {
        question: "Correct: `weil mein Zug hat Verspaetung`.",
        answerKey: ["weil mein Zug Verspaetung hat"],
        explanation: "The verb goes to the end in the `weil` clause."
      },
      {
        question: "What should you ask after suggesting a new time?",
        answerKey: ["Whether the time works.", "Passt dir/Ihnen ...?"],
        explanation: "A plan change is not complete until the other person can confirm."
      }
    ]
  },
  "DE-A21-M02-S05": {
    outcomes: [
      "Complete the module task by changing a plan in writing.",
      "Use apology, reason, alternative, and confirmation question in one message.",
      "Include at least one correct `weil` clause.",
      "Understand a short input that gives the reason for the change.",
      "Check whether the message tone fits the recipient."
    ],
    relevanceMarkdown:
      "This module task proves that you can handle a real disruption: understand the reason, choose the right tone, and send a message the other person can act on.",
    activities: [
      {
        type: "retrieval/review",
        title: "Quick review: final checklist",
        minutes: 6,
        body:
          "Write from memory: `Leider`, `Es tut mir leid`, `weil ... hat`, `weil ... muss`, `Passt dir ...?`, `Passt Ihnen ...?`, `Koennen wir den Termin verschieben?`"
      },
      {
        type: "listening",
        title: "Task input: why the plan changes",
        minutes: 10,
        body:
          "Context: You receive a voice note from a friend before a trip.\n\nAudio script for later recording:\nHallo, ich habe ein Problem. Ich habe meine Fahrkarte verloren und muss am Bahnhof eine neue kaufen. Ich kann nicht um 9 Uhr am Hotel sein. Ich komme wahrscheinlich um 10 Uhr. Kannst du bitte dem Hotel schreiben?\n\nQuestions: What happened? What is the old time? What is the likely new time? What should you do?\nAnswer key: lost ticket; 9:00; probably 10:00; write to the hotel."
      },
      {
        type: "reading",
        title: "Recipient information: hotel message requirements",
        minutes: 8,
        body:
          "Hotel note: `Bitte informieren Sie uns, wenn Sie nach 9 Uhr ankommen. Die Rezeption ist bis 22 Uhr geoeffnet.`\n\nMeaning: Tell the hotel if you arrive after 9. Reception is open until 22:00."
      },
      {
        type: "real-world task",
        title: "Write the hotel message",
        minutes: 18,
        body:
          "Write a formal message to the hotel. Required content: greeting, apology/signal, original time, new time, reason with `weil`, confirmation question, polite close.\n\nFrame:\n`Guten Tag, leider komme ich nicht um __ Uhr, sondern wahrscheinlich um __ Uhr, weil __. Es tut mir leid. Ist das moeglich? Vielen Dank und freundliche Gruesse, ...`"
      },
      {
        type: "mediation",
        title: "Mediation: tell your friend what you wrote",
        minutes: 8,
        body:
          "Summarize in English or simple German: `I wrote to the hotel that you will probably arrive at 10 because you lost your ticket and need to buy a new one. I asked whether that is possible.`"
      },
      {
        type: "writing",
        title: "Revision pass",
        minutes: 8,
        body:
          "Check your message. Did you use formal `Sie`/`Ihnen` style? Did your `weil` clause end with the verb? Did you include the new time? Did you ask a clear question?"
      },
      {
        type: "speaking",
        title: "Spoken confirmation",
        minutes: 8,
        body:
          "Speak a 45-second summary of the situation. Success criteria: listener knows problem, old time, new time, recipient, and action."
      }
    ],
    examples: [
      "Guten Tag, leider komme ich nicht um 9 Uhr, sondern wahrscheinlich um 10 Uhr.",
      "Ich komme spaeter, weil ich meine Fahrkarte verloren habe.",
      "Ist eine Ankunft um 10 Uhr moeglich?"
    ],
    commonMistakes: [
      "Using informal `du` with the hotel.",
      "Writing the reason as `weil ich habe meine Fahrkarte verloren`.",
      "Forgetting to ask whether the new arrival time is possible.",
      "Leaving out the old time, so the change is unclear."
    ],
    guidedPrompt:
      "Use the facts to write the hotel message.\n\nOld time: 9:00\nNew time: probably 10:00\nReason: lost ticket and must buy a new one\nRecipient: hotel\nRequired words: `leider`, `weil`, `Es tut mir leid`, `Ist das moeglich?`",
    guidedSolution:
      "Model answer: `Guten Tag, leider komme ich nicht um 9 Uhr, sondern wahrscheinlich um 10 Uhr, weil ich meine Fahrkarte verloren habe und eine neue kaufen muss. Es tut mir leid. Ist das moeglich? Vielen Dank und freundliche Gruesse.`",
    independentPrompt:
      "Complete the module task with a new situation: change a train, hotel, course, or appointment plan. Write 90-120 words, then add a two-sentence mediation summary for a friend.",
    knowledgeChecks: [
      {
        question: "Why must the hotel receive a message?",
        answerKey: ["Because the arrival is after 9:00.", "because the person will arrive later than planned"],
        explanation: "The hotel note asks for information if arrival is after 9."
      },
      {
        question: "Correct: `weil ich habe meine Fahrkarte verloren`.",
        answerKey: ["weil ich meine Fahrkarte verloren habe"],
        explanation: "In a `weil` clause, the conjugated auxiliary `habe` goes to the end."
      },
      {
        question: "Which closing tone fits a hotel better: `Tschuess` or `Vielen Dank und freundliche Gruesse`?",
        answerKey: ["Vielen Dank und freundliche Gruesse"],
        explanation: "A hotel message needs a polite formal close."
      }
    ]
  }
};
