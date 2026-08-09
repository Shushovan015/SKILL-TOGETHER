import { ApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "../features/auth/HomePage.js";
import { LoginPage } from "../features/auth/LoginPage.js";
import { ProtectedRoute } from "../features/auth/ProtectedRoute.js";
import { RegisterPage } from "../features/auth/RegisterPage.js";
import { AdminContentPage } from "../features/content/AdminContentPage.js";
import { AdminLessonEditorPage } from "../features/content/AdminLessonEditorPage.js";
import { AdminRoute } from "../features/content/AdminRoute.js";
import { TrackCataloguePage } from "../features/content/TrackCataloguePage.js";
import { TrackDetailPage } from "../features/content/TrackDetailPage.js";
import { OnboardingPage } from "../features/planning/OnboardingPage.js";
import { LessonPage } from "../features/planning/LessonPage.js";
import { TodayPage } from "../features/planning/TodayPage.js";
import { WeeklyPlanPage } from "../features/planning/WeeklyPlanPage.js";
import { createApolloClient } from "./apollo-client.js";

export function App(): React.JSX.Element {
  const apolloClient = useMemo(() => createApolloClient(), []);

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
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
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
