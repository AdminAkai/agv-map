// schema.ts
import { createSchema } from 'graphql-yoga'
import db from './db'

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      map: Map
    }

    type Map {
      id: ID!
      maxNeighborDistance: Int!
      nodes: [Node!]!
    }

    type Node {
      id: ID!
      x: Int!
      y: Int!
      code: Int!
      name: String
      directions: [Direction!]!
      charger: Charger
      chute: Chute
    }

    enum Direction {
      North
      South
      East
      West
    }

    type Charger {
      direction: Direction!
    }

    type Chute {
      direction: Direction!
    }
  `,
  resolvers: {
    Query: {
      map: async () => {
        const [mapRow] = await db`
          SELECT id, max_neighbor_distance FROM maps LIMIT 1
        `;
        if (!mapRow) return null;

        const nodeRows = await db`
          SELECT
            n.id, n.x, n.y, n.code, n.name, n.directions,
            array_to_string(n.directions, ',') AS directions_str,
            c.direction AS charger_direction,
            ch.direction AS chute_direction
          FROM nodes n
          LEFT JOIN chargers c ON c.node_id = n.id
          LEFT JOIN chutes ch ON ch.node_id = n.id
          WHERE n.map_id = ${mapRow.id}
          ORDER BY n.code
        `;

        return {
          id: mapRow.id,
          maxNeighborDistance: mapRow.max_neighbor_distance,
          nodes: nodeRows.map((row: any) => ({
            id: row.id,
            x: row.x,
            y: row.y,
            code: row.code,
            name: row.name,
            // found a dumb bug where Bun's sql driver messes up the array types SOMETIMES
            // so for consistency id rather transform the array type myself into a string in the sql above
            // then i can parse it myself here for consumption
            directions: row.directions_str ? row.directions_str.split(',') : [],
            charger: row.charger_direction ? { direction: row.charger_direction } : null,
            chute: row.chute_direction ? { direction: row.chute_direction } : null,
          })),
        };
      },
    },
  },
});

export default schema