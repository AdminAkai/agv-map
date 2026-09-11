import { useState, useEffect } from "react";

import { graphqlRequest } from "../utils/graphql";
import type { AgvMap } from "../utils/types";

const MAP_QUERY = /* GraphQL */ `
  query {
    map {
      id
      maxNeighborDistance
      nodes {
        id x y code name directions
        charger { direction }
        chute { direction }
      }
    }
  }
`;


export function useMapQuery() {
  const [data, setData] = useState<AgvMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const mapRequest = async () => {
      try {
        const data = await graphqlRequest<{ map: AgvMap }>(MAP_QUERY)
        setData(data.map)
      } catch(err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    mapRequest()
  }, []);

  return { data, loading, error };
}