import { zodResolver } from "@hookform/resolvers/zod";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  getFirstGraphqlErrorField,
  toSafeAuthMessage
} from "../../shared/graphql/errors.js";
import { AuthShell } from "./AuthShell.js";
import { fetchCsrfToken, LOGIN_MUTATION, type LoginMutationData } from "./graphql.js";
import { type LoginFormValues, loginFormSchema } from "./auth-form-schemas.js";

interface LoginMutationVariables {
  readonly input: LoginFormValues;
}

interface LoginLocationState {
  readonly returnTo?: string;
}

export function LoginPage(): React.JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | undefined>();
  const [login, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(
    LOGIN_MUTATION
  );
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setFormError(undefined);

    try {
      const csrfToken = await fetchCsrfToken(client);
      await login({
        variables: {
          input: values
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      navigate(resolveReturnPath(location.state), { replace: true });
    } catch (error) {
      const field = getFirstGraphqlErrorField(error);

      if (isLoginField(field)) {
        setError(field, {
          type: "server",
          message: "Check this field and try again."
        });
      }

      setFormError(toSafeAuthMessage(error));
    }
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Log in to SkillTogether">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            aria-invalid={errors.email === undefined ? "false" : "true"}
            {...register("email")}
          />
        </label>
        {errors.email?.message === undefined ? null : (
          <p className="field-error">{errors.email.message}</p>
        )}

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password === undefined ? "false" : "true"}
            {...register("password")}
          />
        </label>
        {errors.password?.message === undefined ? null : (
          <p className="field-error">{errors.password.message}</p>
        )}

        {formError === undefined ? null : (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="auth-panel__helper">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

function resolveReturnPath(state: unknown): string {
  if (typeof state !== "object" || state === null || !("returnTo" in state)) {
    return "/today";
  }

  const value = (state as LoginLocationState).returnTo;
  return value?.startsWith("/") === true && !value.startsWith("//") ? value : "/today";
}

function isLoginField(value: string | undefined): value is keyof LoginFormValues {
  return value === "email" || value === "password";
}
