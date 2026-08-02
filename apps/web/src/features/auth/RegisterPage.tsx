import { zodResolver } from "@hookform/resolvers/zod";
import { useApolloClient } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  getFirstGraphqlErrorField,
  toSafeAuthMessage
} from "../../shared/graphql/errors.js";
import { AuthShell } from "./AuthShell.js";
import {
  fetchCsrfToken,
  type RegisterMutationData,
  REGISTER_MUTATION
} from "./graphql.js";
import {
  type RegistrationFormValues,
  registrationFormSchema
} from "./auth-form-schemas.js";

interface RegisterMutationVariables {
  readonly input: RegistrationFormValues;
}

export function RegisterPage(): React.JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | undefined>();
  const defaultTimeZone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }, []);
  const [registerAccount, { loading }] = useMutation<
    RegisterMutationData,
    RegisterMutationVariables
  >(REGISTER_MUTATION);
  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      timeZone: defaultTimeZone
    }
  });

  async function onSubmit(values: RegistrationFormValues): Promise<void> {
    setFormError(undefined);

    try {
      const csrfToken = await fetchCsrfToken(client);
      await registerAccount({
        variables: {
          input: values
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      navigate("/today", { replace: true });
    } catch (error) {
      const field = getFirstGraphqlErrorField(error);

      if (isRegistrationField(field)) {
        setError(field, {
          type: "server",
          message: "Check this field and try again."
        });
      }

      setFormError(toSafeAuthMessage(error));
    }
  }

  return (
    <AuthShell eyebrow="Create account" title="Start with SkillTogether">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            aria-invalid={errors.email === undefined ? "false" : "true"}
            {...registerField("email")}
          />
        </label>
        {errors.email?.message === undefined ? null : (
          <p className="field-error">{errors.email.message}</p>
        )}

        <label>
          Password
          <input
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password === undefined ? "false" : "true"}
            {...registerField("password")}
          />
        </label>
        {errors.password?.message === undefined ? null : (
          <p className="field-error">{errors.password.message}</p>
        )}

        <label>
          Display name
          <input
            type="text"
            autoComplete="name"
            aria-invalid={errors.displayName === undefined ? "false" : "true"}
            {...registerField("displayName")}
          />
        </label>
        {errors.displayName?.message === undefined ? null : (
          <p className="field-error">{errors.displayName.message}</p>
        )}

        <label>
          Time zone
          <input
            type="text"
            autoComplete="off"
            aria-invalid={errors.timeZone === undefined ? "false" : "true"}
            {...registerField("timeZone")}
          />
        </label>
        {errors.timeZone?.message === undefined ? null : (
          <p className="field-error">{errors.timeZone.message}</p>
        )}

        {formError === undefined ? null : (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

function isRegistrationField(value: string | undefined): value is keyof RegistrationFormValues {
  return (
    value === "email" ||
    value === "password" ||
    value === "displayName" ||
    value === "timeZone"
  );
}
