import { gql } from "@apollo/client";

export type TrackType = "SOFTWARE_ENGINEERING" | "PROJECT_MANAGEMENT" | "GERMAN";
export type EnrollmentStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type ContentStatus = "DRAFT" | "REVIEWED" | "APPROVED" | "ARCHIVED";

export interface LessonSummary {
  readonly id: string;
  readonly slug: string;
  readonly sequence: number;
  readonly title: string;
  readonly difficulty: string;
  readonly estimatedDurationMinutes: number;
  readonly required: boolean;
  readonly prerequisites: readonly string[];
}

export interface LearningModule {
  readonly id: string;
  readonly sequence: number;
  readonly title: string;
  readonly summary: string;
  readonly lessons: readonly LessonSummary[];
}

export interface LearningTrack {
  readonly id: string;
  readonly slug: string;
  readonly type: TrackType;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly modules: readonly LearningModule[];
}

export interface Enrollment {
  readonly id: string;
  readonly userId: string;
  readonly status: EnrollmentStatus;
  readonly track: LearningTrack;
  readonly startDate: string;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
  readonly germanStartLevel: string | null;
  readonly germanTargetLevel: string | null;
  readonly germanSessionDurationMinutes: number | null;
  readonly totalTaskCount: number;
  readonly completedTaskCount: number;
  readonly overallProgressPercentage: number;
  readonly currentDailyTaskId: string | null;
  readonly currentLessonId: string | null;
  readonly currentModuleTitle: string | null;
  readonly currentLessonTitle: string | null;
  readonly completedLessonIds: readonly string[];
}

export interface Resource {
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

export interface Exercise {
  readonly id: string;
  readonly kind: string;
  readonly promptMarkdown: string;
  readonly expectedEvidence: string;
  readonly solutionNotesMarkdown: string | null;
}

export interface KnowledgeCheck {
  readonly id: string;
  readonly question: string;
  readonly answerKey: readonly string[];
  readonly explanation: string;
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
  readonly resources: readonly Omit<Resource, "id">[];
  readonly exercises: readonly Omit<Exercise, "id">[];
  readonly knowledgeChecks: readonly Omit<KnowledgeCheck, "id">[];
}

export interface AdminLessonVersion {
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
  readonly approvedAt: string | null;
  readonly archivedAt: string | null;
  readonly resources: readonly Resource[];
  readonly exercises: readonly Exercise[];
  readonly knowledgeChecks: readonly KnowledgeCheck[];
  readonly lessonSlug: string;
  readonly moduleTitle: string;
  readonly trackTitle: string;
  readonly trackSlug: string;
}

export interface LearningTracksQueryData {
  readonly learningTracks: readonly LearningTrack[];
}

export interface LearningTrackQueryData {
  readonly learningTrack: LearningTrack;
}

export interface LearningTrackQueryVariables {
  readonly slug: string;
}

export interface MyEnrollmentsQueryData {
  readonly myEnrollments: readonly Enrollment[];
}

export interface SelectLearningTrackMutationData {
  readonly selectLearningTrack: Enrollment;
}

export interface SelectLearningTrackMutationVariables {
  readonly input: {
    readonly trackId: string;
    readonly startDate: string;
    readonly experienceLevel: string;
    readonly targetOutcome: string;
    readonly germanStartLevel: string | null;
    readonly germanTargetLevel: string | null;
    readonly germanSessionDurationMinutes: number | null;
  };
}

export interface AdminLessonVersionsQueryData {
  readonly adminLessonVersions: readonly AdminLessonVersion[];
}

export interface AdminLessonVersionsQueryVariables {
  readonly status?: ContentStatus;
}

export interface AdminLessonVersionQueryData {
  readonly adminLessonVersion: AdminLessonVersion;
}

export interface AdminLessonVersionQueryVariables {
  readonly id: string;
}

export interface CreateLessonVersionMutationData {
  readonly createLessonVersion: AdminLessonVersion;
}

export interface CreateLessonVersionMutationVariables {
  readonly lessonId: string;
  readonly input: LessonVersionEditorInput;
}

export interface UpdateLessonVersionMutationData {
  readonly updateLessonVersion: AdminLessonVersion;
}

export interface UpdateLessonVersionMutationVariables {
  readonly id: string;
  readonly input: LessonVersionEditorInput;
}

export interface TransitionLessonVersionMutationData {
  readonly submitLessonVersionForReview?: AdminLessonVersion;
  readonly approveLessonVersion?: AdminLessonVersion;
  readonly archiveLessonVersion?: AdminLessonVersion;
}

export interface TransitionLessonVersionMutationVariables {
  readonly id: string;
}

export const LESSON_FIELDS = gql`
  fragment LessonFields on LessonSummary {
    id
    slug
    sequence
    title
    difficulty
    estimatedDurationMinutes
    required
    prerequisites
  }
`;

export const TRACK_FIELDS = gql`
  fragment TrackFields on LearningTrack {
    id
    slug
    type
    title
    description
    active
    modules {
      id
      sequence
      title
      summary
      lessons {
        ...LessonFields
      }
    }
  }
  ${LESSON_FIELDS}
`;

export const ADMIN_LESSON_VERSION_FIELDS = gql`
  fragment AdminLessonVersionFields on AdminLessonVersion {
    id
    lessonId
    version
    status
    title
    learningObjective
    outcomes
    explanationMarkdown
    relevanceMarkdown
    examples
    commonMistakes
    assessmentTags
    authorId
    reviewerId
    approvedAt
    archivedAt
    lessonSlug
    moduleTitle
    trackTitle
    trackSlug
    resources {
      id
      title
      provider
      url
      resourceType
      difficulty
      estimatedMinutes
      description
      verificationStatus
      required
      approved
      citation
    }
    exercises {
      id
      kind
      promptMarkdown
      expectedEvidence
      solutionNotesMarkdown
    }
    knowledgeChecks {
      id
      question
      answerKey
      explanation
    }
  }
`;

export const LEARNING_TRACKS_QUERY = gql`
  query LearningTracks {
    learningTracks {
      ...TrackFields
    }
  }
  ${TRACK_FIELDS}
`;

export const LEARNING_TRACK_QUERY = gql`
  query LearningTrack($slug: String!) {
    learningTrack(slug: $slug) {
      ...TrackFields
    }
  }
  ${TRACK_FIELDS}
`;

export const MY_ENROLLMENTS_QUERY = gql`
  query MyEnrollments {
    myEnrollments {
      id
      userId
      status
      startDate
      targetOutcome
      experienceLevel
      germanStartLevel
      germanTargetLevel
      germanSessionDurationMinutes
      totalTaskCount
      completedTaskCount
      overallProgressPercentage
      currentDailyTaskId
      currentLessonId
      currentModuleTitle
      currentLessonTitle
      completedLessonIds
      track {
        ...TrackFields
      }
    }
  }
  ${TRACK_FIELDS}
`;

export const SELECT_LEARNING_TRACK_MUTATION = gql`
  mutation SelectLearningTrack($input: SelectLearningTrackInput!) {
    selectLearningTrack(input: $input) {
      id
      status
      startDate
      targetOutcome
      experienceLevel
      germanStartLevel
      germanTargetLevel
      germanSessionDurationMinutes
      track {
        id
        slug
        title
      }
    }
  }
`;

export const ADMIN_LESSON_VERSIONS_QUERY = gql`
  query AdminLessonVersions($status: ContentStatus) {
    adminLessonVersions(status: $status) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const ADMIN_LESSON_VERSION_QUERY = gql`
  query AdminLessonVersion($id: ID!) {
    adminLessonVersion(id: $id) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const CREATE_LESSON_VERSION_MUTATION = gql`
  mutation CreateLessonVersion($lessonId: ID!, $input: LessonVersionEditorInput!) {
    createLessonVersion(lessonId: $lessonId, input: $input) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const UPDATE_LESSON_VERSION_MUTATION = gql`
  mutation UpdateLessonVersion($id: ID!, $input: LessonVersionEditorInput!) {
    updateLessonVersion(id: $id, input: $input) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const SUBMIT_LESSON_VERSION_MUTATION = gql`
  mutation SubmitLessonVersionForReview($id: ID!) {
    submitLessonVersionForReview(id: $id) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const APPROVE_LESSON_VERSION_MUTATION = gql`
  mutation ApproveLessonVersion($id: ID!) {
    approveLessonVersion(id: $id) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;

export const ARCHIVE_LESSON_VERSION_MUTATION = gql`
  mutation ArchiveLessonVersion($id: ID!) {
    archiveLessonVersion(id: $id) {
      ...AdminLessonVersionFields
    }
  }
  ${ADMIN_LESSON_VERSION_FIELDS}
`;
