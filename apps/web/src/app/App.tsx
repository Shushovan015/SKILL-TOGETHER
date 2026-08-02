import { ApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "../features/auth/HomePage.js";
import { LoginPage } from "../features/auth/LoginPage.js";
import { ProtectedRoute } from "../features/auth/ProtectedRoute.js";
import { RegisterPage } from "../features/auth/RegisterPage.js";
import { TodayPage } from "../features/auth/TodayPage.js";
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
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
