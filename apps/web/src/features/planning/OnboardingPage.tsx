import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  COMPLETE_ONBOARDING_MUTATION,
  PLANNING_TRACKS_QUERY,
  type CompleteOnboardingMutationData,
  type CompleteOnboardingMutationVariables,
  type LearningTracksQueryData
} from "./graphql.js";
import { toSafePlanningMessage, todayDateInputValue } from "./planning-ui.js";

const defaultStudyDays = [1, 2, 3, 4, 5] as const;
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
  const tracks = useQuery<LearningTracksQueryData>(PLANNING_TRACKS_QUERY);
  const [completeOnboarding, completeState] = useMutation<
    CompleteOnboardingMutationData,
    CompleteOnboardingMutationVariables
  >(COMPLETE_ONBOARDING_MUTATION);
  const [trackId, setTrackId] = useState("");
  const [startDate, setStartDate] = useState(todayDateInputValue());
  const [studyDays, setStudyDays] = useState<readonly number[]>(defaultStudyDays);
  const [minutes, setMinutes] = useState(120);
  const [recoveryMinutes, setRecoveryMinutes] = useState(120);
  const [assessmentDay, setAssessmentDay] = useState(5);
  const [recoveryDay, setRecoveryDay] = useState(6);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [targetOutcome, setTargetOutcome] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const trackList = tracks.data?.learningTracks ?? [];
  const selectedTrackId = trackId.length === 0 ? trackList[0]?.id ?? "" : trackId;

  useEffect(() => {
    if (trackId.length === 0 && selectedTrackId.length > 0) {
      setTrackId(selectedTrackId);
    }
  }, [selectedTrackId, trackId]);

  async function submit(): Promise<void> {
    setFormError(undefined);

    if (trackId.length === 0 || targetOutcome.trim().length === 0) {
      setFormError("Choose a track and target outcome.");
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken(client);
      await completeOnboarding({
        variables: {
          input: {
            trackId,
            startDate,
            studyDays,
            availableMinutesByDay: availabilityByDay(studyDays, minutes, recoveryDay, recoveryMinutes),
            preferredSessionTime: null,
            experienceLevel,
            targetOutcome,
            assessmentDay,
            recoveryDay,
            pausePeriods: []
          }
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      navigate("/today", { replace: true });
    } catch (error) {
      setFormError(toSafePlanningMessage(error));
    }
  }

  if (tracks.loading && tracks.data?.learningTracks === undefined) {
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

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="onboarding-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Onboarding</p>
          <h1 id="onboarding-title">Create your study plan</h1>
          <p>Set your track, days, and available minutes.</p>
        </div>
      </section>

      <form className="editor-form planner-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Learning track
          <select value={selectedTrackId} onChange={(event) => setTrackId(event.target.value)}>
            {trackList.map((track) => (
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

        <label>
          Available minutes on study days
          <input type="number" min={15} max={480} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} />
        </label>

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

        <label>
          Recovery-day minutes
          <input type="number" min={15} max={480} value={recoveryMinutes} onChange={(event) => setRecoveryMinutes(Number(event.target.value))} />
        </label>

        <label>
          Experience level
          <input value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} />
        </label>

        <label>
          Target outcome
          <textarea rows={4} value={targetOutcome} onChange={(event) => setTargetOutcome(event.target.value)} />
        </label>

        {formError === undefined ? null : (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="button" disabled={completeState.loading} onClick={() => void submit()}>
          {completeState.loading ? "Creating..." : "Create plan"}
        </button>
      </form>
    </main>
  );
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
