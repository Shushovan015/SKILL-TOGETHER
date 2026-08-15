import { ApolloProvider } from "@apollo/client/react";
import { lazy, Suspense, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../features/auth/ProtectedRoute.js";
import { AdminRoute } from "../features/content/AdminRoute.js";
import { createApolloClient } from "./apollo-client.js";

const PartnerPage = lazy(() => import("../features/accountability/PartnerPage.js").then((module) => ({ default: module.PartnerPage })));
const HomePage = lazy(() => import("../features/auth/HomePage.js").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("../features/auth/LoginPage.js").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../features/auth/RegisterPage.js").then((module) => ({ default: module.RegisterPage })));
const AssessmentPage = lazy(() => import("../features/assessment/AssessmentPage.js").then((module) => ({ default: module.AssessmentPage })));
const AssessmentResultPage = lazy(() => import("../features/assessment/AssessmentResultPage.js").then((module) => ({ default: module.AssessmentResultPage })));
const AdminContentPage = lazy(() => import("../features/content/AdminContentPage.js").then((module) => ({ default: module.AdminContentPage })));
const AdminLessonEditorPage = lazy(() => import("../features/content/AdminLessonEditorPage.js").then((module) => ({ default: module.AdminLessonEditorPage })));
const RoadmapPage = lazy(() => import("../features/content/RoadmapPage.js").then((module) => ({ default: module.RoadmapPage })));
const TrackCataloguePage = lazy(() => import("../features/content/TrackCataloguePage.js").then((module) => ({ default: module.TrackCataloguePage })));
const TrackDetailPage = lazy(() => import("../features/content/TrackDetailPage.js").then((module) => ({ default: module.TrackDetailPage })));
const OnboardingPage = lazy(() => import("../features/planning/OnboardingPage.js").then((module) => ({ default: module.OnboardingPage })));
const LessonPage = lazy(() => import("../features/planning/LessonPage.js").then((module) => ({ default: module.LessonPage })));
const ProgressPage = lazy(() => import("../features/planning/ProgressPage.js").then((module) => ({ default: module.ProgressPage })));
const TodayPage = lazy(() => import("../features/planning/TodayPage.js").then((module) => ({ default: module.TodayPage })));
const WeeklyPlanPage = lazy(() => import("../features/planning/WeeklyPlanPage.js").then((module) => ({ default: module.WeeklyPlanPage })));
const NotFoundPage = lazy(() => import("./NotFoundPage.js").then((module) => ({ default: module.NotFoundPage })));

export function App(): React.JSX.Element {
  const apolloClient = useMemo(() => createApolloClient(), []);

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Suspense fallback={<main className="status-page" aria-live="polite">Loading page...</main>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/today"
            element={
              <ProtectedRoute>
                <TodayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/week/:weekNumber"
            element={
              <ProtectedRoute>
                <WeeklyPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:dailyTaskId"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:dailyTaskId/exercise"
            element={
              <ProtectedRoute>
                <LessonPage exerciseOnly />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/week/:studyWeekId"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/:attemptId/result"
            element={
              <ProtectedRoute>
                <AssessmentResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute>
                <PartnerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracks"
            element={
              <ProtectedRoute>
                <TrackCataloguePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracks/:slug"
            element={
              <ProtectedRoute>
                <TrackDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminContentPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content/:versionId"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLessonEditorPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ApolloProvider>
  );
}
