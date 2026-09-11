const GRAPHQL_ENDPOINT = "/graphql";

// graphql helper so I don't have to use a library for simple queries but also writing this helped me understand a little about how apollo works under the hood
export const graphqlRequest = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}