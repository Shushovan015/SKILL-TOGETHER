import { gql, type ApolloClient } from "@apollo/client";

export interface UserProfile {
  readonly displayName: string;
  readonly timeZone: string;
  readonly preferredSessionTime: string | null;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly profile: UserProfile;
  readonly roles: readonly string[];
}

export interface AuthPayloadData {
  readonly user: User;
}

export interface CsrfTokenQueryData {
  readonly csrfToken: string;
}

export interface MeQueryData {
  readonly me: User;
}

export interface RegisterMutationData {
  readonly register: AuthPayloadData;
}

export interface LoginMutationData {
  readonly login: AuthPayloadData;
}

export interface LogoutMutationData {
  readonly logout: boolean;
}

export const CSRF_TOKEN_QUERY = gql`
  query CsrfToken {
    csrfToken
  }
`;

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    roles
    profile {
      displayName
      timeZone
      preferredSessionTime
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export async function fetchCsrfToken(client: ApolloClient): Promise<string> {
  const result = await client.query<CsrfTokenQueryData>({
    query: CSRF_TOKEN_QUERY,
    fetchPolicy: "network-only"
  });

  if (result.data?.csrfToken === undefined) {
    throw new Error("CSRF token was not returned.");
  }

  return result.data.csrfToken;
}
