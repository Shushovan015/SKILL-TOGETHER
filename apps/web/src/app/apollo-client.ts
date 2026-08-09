import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient(): ApolloClient {
  const apiUrl =
    import.meta.env["VITE_GRAPHQL_URL"] ??
    import.meta.env["VITE_API_URL"] ??
    "http://localhost:4000/graphql";

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: apiUrl,
      credentials: "include"
    })
  });
}
