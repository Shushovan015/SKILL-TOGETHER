export type TrackType = "SOFTWARE_ENGINEERING" | "PROJECT_MANAGEMENT" | "GERMAN";
export type ContentStatus = "DRAFT" | "REVIEWED" | "APPROVED" | "ARCHIVED";
export type EnrollmentStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type GermanLevel =
  | "COMPLETE_BEGINNER"
  | "A1.1"
  | "A1.2"
  | "A2.1"
  | "A2.2"
  | "B1.1"
  | "B1.2"
  | "B2.1"
  | "B2.2";

export interface GermanEnrollmentPreferences {
  readonly startLevel: GermanLevel;
  readonly targetLevel: Exclude<GermanLevel, "COMPLETE_BEGINNER">;
  readonly sessionDurationMinutes: 30 | 45 | 60 | 90;
}

export interface ResourceRecord {
  readonly id: string;
  readonly title: string;
  readonly provider: string;
  readonly url: string;
  readonly resourceType: string;
  readonly difficulty: string;
  readonly estimatedMinutes: number;
  readonly description: string;
  readonly verificationStatus: string;
  readonly required: boolean;
  readonly approved: boolean;
  readonly citation: string;
}

export interface ExerciseRecord {
  readonly id: string;
  readonly kind: string;
  readonly promptMarkdown: string;
  readonly expectedEvidence: string;
  readonly solutionNotesMarkdown: string | null;
}

export interface KnowledgeCheckRecord {
  readonly id: string;
  readonly question: string;
  readonly answerKey: readonly string[];
  readonly explanation: string;
}

export interface LessonVersionRecord {
  readonly id: string;
  readonly lessonId: string;
  readonly version: number;
  readonly status: ContentStatus;
  readonly title: string;
  readonly learningObjective: string;
  readonly outcomes: readonly string[];
  readonly explanationMarkdown: string;
  readonly relevanceMarkdown: string;
  readonly examples: readonly string[];
  readonly commonMistakes: readonly string[];
  readonly assessmentTags: readonly string[];
  readonly authorId: string;
  readonly reviewerId: string | null;
  readonly approvedAt: Date | null;
  readonly archivedAt: Date | null;
  readonly resources: readonly ResourceRecord[];
  readonly exercises: readonly ExerciseRecord[];
  readonly knowledgeChecks: readonly KnowledgeCheckRecord[];
}

export interface LessonSummaryRecord {
  readonly id: string;
  readonly slug: string;
  readonly sequence: number;
  readonly title: string;
  readonly difficulty: string;
  readonly estimatedDurationMinutes: number;
  readonly required: boolean;
  readonly prerequisites: readonly string[];
}

export interface ModuleRecord {
  readonly id: string;
  readonly sequence: number;
  readonly title: string;
  readonly summary: string;
  readonly lessons: readonly LessonSummaryRecord[];
}

export interface LearningTrackRecord {
  readonly id: string;
  readonly slug: string;
  readonly type: TrackType;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly modules: readonly ModuleRecord[];
}

export interface EnrollmentRecord {
  readonly id: string;
  readonly userId: string;
  readonly status: EnrollmentStatus;
  readonly track: LearningTrackRecord;
  readonly startDate: Date;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
  readonly germanStartLevel: GermanLevel | null;
  readonly germanTargetLevel: Exclude<GermanLevel, "COMPLETE_BEGINNER"> | null;
  readonly germanSessionDurationMinutes: 30 | 45 | 60 | 90 | null;
}

export interface LessonVersionEditorInput {
  readonly title: string;
  readonly learningObjective: string;
  readonly outcomes: readonly string[];
  readonly explanationMarkdown: string;
  readonly relevanceMarkdown: string;
  readonly examples: readonly string[];
  readonly commonMistakes: readonly string[];
  readonly assessmentTags: readonly string[];
  readonly resources: readonly Omit<ResourceRecord, "id">[];
  readonly exercises: readonly Omit<ExerciseRecord, "id">[];
  readonly knowledgeChecks: readonly Omit<KnowledgeCheckRecord, "id">[];
}

export interface AdminLessonVersionRecord extends LessonVersionRecord {
  readonly lessonSlug: string;
  readonly moduleTitle: string;
  readonly trackTitle: string;
  readonly trackSlug: string;
}

export interface SelectLearningTrackInput {
  readonly trackId: string;
  readonly startDate: Date;
  readonly experienceLevel: string;
  readonly targetOutcome: string;
  readonly germanStartLevel: GermanLevel | null;
  readonly germanTargetLevel: Exclude<GermanLevel, "COMPLETE_BEGINNER"> | null;
  readonly germanSessionDurationMinutes: 30 | 45 | 60 | 90 | null;
}
