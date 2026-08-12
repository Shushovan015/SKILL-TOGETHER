import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import { MY_ENROLLMENTS_QUERY, type MyEnrollmentsQueryData } from "../content/graphql.js";
import {
  COMPLETE_ONBOARDING_MUTATION,
  PLANNING_TRACKS_QUERY,
  RECONFIGURE_ENROLLMENT_MUTATION,
  type CompleteOnboardingMutationData,
  type CompleteOnboardingMutationVariables,
  type LearningTracksQueryData,
  type ReconfigureEnrollmentMutationData,
  type ReconfigureEnrollmentMutationVariables
} from "./graphql.js";
import { toSafePlanningMessage, todayDateInputValue } from "./planning-ui.js";

const defaultStudyDays = [1, 2, 3, 4, 5] as const;
const germanLevels = [
  { value: "COMPLETE_BEGINNER", label: "Complete Beginner" },
  { value: "A1.1", label: "A1.1" },
  { value: "A1.2", label: "A1.2" },
  { value: "A2.1", label: "A2.1" },
  { value: "A2.2", label: "A2.2" },
  { value: "B1.1", label: "B1.1" },
  { value: "B1.2", label: "B1.2" },
  { value: "B2.1", label: "B2.1" },
  { value: "B2.2", label: "B2.2" },
  { value: "C1.1", label: "C1.1" },
  { value: "C1.2", label: "C1.2" },
  { value: "C2.1", label: "C2.1" },
  { value: "C2.2", label: "C2.2" }
] as const;
const germanTargetLevels = germanLevels.filter((level) => level.value !== "COMPLETE_BEGINNER");
const germanSessionDurations = [30, 45, 60, 90] as const;
const professionalSessionDurations = [60, 90, 120] as const;
const softwareEngineeringExperienceLevel = "JavaScript Frontend Developer - TypeScript New";
const dayOptions = [
  ["0", "Sun"],
  ["1", "Mon"],
  ["2", "Tue"],
  ["3", "Wed"],
  ["4", "Thu"],
  ["5", "Fri"],
  ["6", "Sat"]
] as const;

export function OnboardingPage(): React.JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tracks = useQuery<LearningTracksQueryData>(PLANNING_TRACKS_QUERY);
  const enrollments = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const [completeOnboarding, completeState] = useMutation<
    CompleteOnboardingMutationData,
    CompleteOnboardingMutationVariables
  >(COMPLETE_ONBOARDING_MUTATION);
  const [reconfigureEnrollment, reconfigureState] = useMutation<
    ReconfigureEnrollmentMutationData,
    ReconfigureEnrollmentMutationVariables
  >(RECONFIGURE_ENROLLMENT_MUTATION);
  const reconfigureEnrollmentId = searchParams.get("reconfigureEnrollmentId") ?? "";
  const [trackId, setTrackId] = useState(searchParams.get("trackId") ?? "");
  const [startDate, setStartDate] = useState(todayDateInputValue());
  const [studyDays, setStudyDays] = useState<readonly number[]>(defaultStudyDays);
  const [minutes, setMinutes] = useState(120);
  const [recoveryMinutes, setRecoveryMinutes] = useState(120);
  const [assessmentDay, setAssessmentDay] = useState(5);
  const [recoveryDay, setRecoveryDay] = useState(6);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [germanStartLevel, setGermanStartLevel] = useState("COMPLETE_BEGINNER");
  const [germanTargetLevel, setGermanTargetLevel] = useState("A1.2");
  const [germanSessionDurationMinutes, setGermanSessionDurationMinutes] = useState(60);
  const [targetOutcome, setTargetOutcome] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const isReconfiguring = reconfigureEnrollmentId.length > 0;
  const activeTrackIds = new Set(
    (enrollments.data?.myEnrollments ?? [])
      .filter((enrollment) =>
        ["ACTIVE", "PAUSED"].includes(enrollment.status) &&
        enrollment.id !== reconfigureEnrollmentId
      )
      .map((enrollment) => enrollment.track.id)
  );
  const availableTrackList = (tracks.data?.learningTracks ?? []).filter((track) => !activeTrackIds.has(track.id));
  const selectedTrackId = availableTrackList.some((track) => track.id === trackId)
    ? trackId
    : availableTrackList[0]?.id ?? "";
  const selectedTrack = availableTrackList.find((track) => track.id === selectedTrackId);
  const isGerman = selectedTrack?.type === "GERMAN";
  const isSoftwareEngineering = selectedTrack?.type === "SOFTWARE_ENGINEERING";
  const isProjectManagement = selectedTrack?.type === "PROJECT_MANAGEMENT";
  const germanAvailableTargetLevels = germanTargetLevels.filter(
    (level) => compareGermanLevelValues(level.value, normalizedGermanStartLevel(germanStartLevel)) > 0
  );
  const selectedGermanTargetLevel = germanAvailableTargetLevels.some((level) => level.value === germanTargetLevel)
    ? germanTargetLevel
    : germanAvailableTargetLevels[0]?.value ?? "A1.2";
  const selectedExperienceLevel = isSoftwareEngineering
    ? softwareEngineeringExperienceLevel
    : isProjectManagement
      ? "Beginner"
      : experienceLevel;
  const selectedMinutes = isGerman ? germanSessionDurationMinutes : professionalMinutesValue(minutes);
  const selectedRecoveryMinutes = isGerman ? germanSessionDurationMinutes : recoveryMinutes;

  async function submit(): Promise<void> {
    setFormError(undefined);

    if (selectedTrackId.length === 0 || targetOutcome.trim().length === 0) {
      setFormError("Choose a track and target outcome.");
      return;
    }

    if (isGerman && germanAvailableTargetLevels.length === 0) {
      setFormError("Choose a German target level above your current level.");
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken(client);
      const input = {
        trackId: selectedTrackId,
        startDate,
        studyDays,
        availableMinutesByDay: availabilityByDay(
          studyDays,
          selectedMinutes,
          recoveryDay,
          selectedRecoveryMinutes
        ),
        preferredSessionTime: null,
        experienceLevel: isGerman ? germanStartLevel : selectedExperienceLevel,
        targetOutcome,
        germanStartLevel: isGerman ? germanStartLevel : null,
        germanTargetLevel: isGerman ? selectedGermanTargetLevel : null,
        germanSessionDurationMinutes: isGerman ? germanSessionDurationMinutes : null,
        assessmentDay,
        recoveryDay,
        pausePeriods: []
      } as const;

      if (isReconfiguring) {
        await reconfigureEnrollment({
          variables: {
            input: {
              ...input,
              enrollmentId: reconfigureEnrollmentId
            }
          },
          context: {
            headers: {
              "x-csrf-token": csrfToken
            }
          }
        });
      } else {
        await completeOnboarding({
          variables: {
            input
          },
          context: {
            headers: {
              "x-csrf-token": csrfToken
            }
          }
        });
      }

      navigate("/tracks", { replace: true });
    } catch (error) {
      setFormError(toSafePlanningMessage(error));
    }
  }

  if (
    (tracks.loading && tracks.data?.learningTracks === undefined) ||
    (enrollments.loading && enrollments.data?.myEnrollments === undefined)
  ) {
    return (
      <main className="status-page" aria-live="polite">
        Loading onboarding...
      </main>
    );
  }

  if (tracks.error !== undefined && tracks.data?.learningTracks === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(tracks.error)}
      </main>
    );
  }

  if (enrollments.error !== undefined && enrollments.data?.myEnrollments === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(enrollments.error)}
      </main>
    );
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="onboarding-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">{isReconfiguring ? "Change plan" : "Onboarding"}</p>
          <h1 id="onboarding-title">{isReconfiguring ? "Change your study plan" : "Create your study plan"}</h1>
          <p>
            {isReconfiguring
              ? "Choose the new level, study days, and time for the replacement plan."
              : "Choose the track, level, study days, and time you can realistically protect."}
          </p>
        </div>
        <Link className="button-link button-link--secondary" to="/tracks">
          Back to My Tracks
        </Link>
      </section>

      {availableTrackList.length === 0 ? (
        <section className="content-empty">
          <p>{isReconfiguring ? "This plan is no longer available." : "All available tracks already have active plans."}</p>
          <Link className="button-link" to="/tracks">
            My Tracks
          </Link>
        </section>
      ) : (
      <form className="editor-form planner-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Learning track
          <select
            value={selectedTrackId}
            disabled={isReconfiguring}
            onChange={(event) => setTrackId(event.target.value)}
          >
            {availableTrackList.map((track) => (
              <option value={track.id} key={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <fieldset className="planner-days">
          <legend>Study days</legend>
          {dayOptions.map(([value, label]) => {
            const day = Number(value);

            return (
              <label className="checkbox-row" key={value}>
                <input
                  type="checkbox"
                  checked={studyDays.includes(day)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...studyDays, day]
                      : studyDays.filter((studyDay) => studyDay !== day);
                    setStudyDays(next.sort((left, right) => left - right));
                  }}
                />
                {label}
              </label>
            );
          })}
        </fieldset>

        {isGerman ? (
          <>
            <label>
              Current level
              <select value={germanStartLevel} onChange={(event) => setGermanStartLevel(event.target.value)}>
                {germanLevels.map((level) => (
                  <option value={level.value} key={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Target level
              <select value={selectedGermanTargetLevel} onChange={(event) => setGermanTargetLevel(event.target.value)}>
                {germanAvailableTargetLevels.map((level) => (
                  <option value={level.value} key={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Preferred German session duration
              <select value={germanSessionDurationMinutes} onChange={(event) => setGermanSessionDurationMinutes(Number(event.target.value))}>
                {germanSessionDurations.map((duration) => (
                  <option value={duration} key={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label>
              Current level
              <select value={selectedExperienceLevel} onChange={(event) => setExperienceLevel(event.target.value)}>
                {isSoftwareEngineering ? (
                  <option value={softwareEngineeringExperienceLevel}>
                    JavaScript frontend developer, TypeScript new
                  </option>
                ) : null}
                {isProjectManagement ? <option value="Beginner">Beginner</option> : null}
                {!isSoftwareEngineering && !isProjectManagement ? (
                  <>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </>
                ) : null}
              </select>
            </label>

            <label>
              Available minutes on study days
              <select value={selectedMinutes} onChange={(event) => setMinutes(Number(event.target.value))}>
                {professionalSessionDurations.map((duration) => (
                  <option value={duration} key={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label>
          Assessment day
          <select value={assessmentDay} onChange={(event) => setAssessmentDay(Number(event.target.value))}>
            {dayOptions.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Recovery day
          <select value={recoveryDay} onChange={(event) => setRecoveryDay(Number(event.target.value))}>
            {dayOptions.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {!isGerman ? (
          <label>
            Recovery-day minutes
            <input type="number" min={15} max={480} value={recoveryMinutes} onChange={(event) => setRecoveryMinutes(Number(event.target.value))} />
          </label>
        ) : null}

        <label>
          Target outcome
          <textarea rows={4} value={targetOutcome} onChange={(event) => setTargetOutcome(event.target.value)} />
        </label>

        {formError === undefined ? null : (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="button" disabled={completeState.loading || reconfigureState.loading} onClick={() => void submit()}>
          {completeState.loading || reconfigureState.loading
            ? "Saving..."
            : isReconfiguring
              ? "Save new plan"
              : "Create plan"}
        </button>
      </form>
      )}
    </main>
  );
}

function normalizedGermanStartLevel(level: string): string {
  return level === "COMPLETE_BEGINNER" ? "A1.1" : level;
}

function compareGermanLevelValues(left: string, right: string): number {
  const order = [
    "A1.1",
    "A1.2",
    "A2.1",
    "A2.2",
    "B1.1",
    "B1.2",
    "B2.1",
    "B2.2",
    "C1.1",
    "C1.2",
    "C2.1",
    "C2.2"
  ];
  return order.indexOf(left) - order.indexOf(right);
}

function professionalMinutesValue(minutes: number): number {
  return professionalSessionDurations.some((duration) => duration === minutes) ? minutes : 120;
}

function availabilityByDay(
  studyDays: readonly number[],
  minutes: number,
  recoveryDay: number,
  recoveryMinutes: number
): Readonly<Record<string, number>> {
  return Object.fromEntries([
    ...studyDays.map((day) => [String(day), minutes] as const),
    [String(recoveryDay), recoveryMinutes] as const
  ]);
}
