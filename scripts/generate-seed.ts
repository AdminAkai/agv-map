import mapData from "./dummy.json";

const mapId = "00000000-0000-0000-0000-000000000001"; // fixed, known UUID for the single seeded map

let sql = `INSERT INTO maps (id, max_neighbor_distance) VALUES ('${mapId}', ${mapData.map.maxNeighborDistance});\n\n`;

for (const node of mapData.map.nodes) {
  const nodeId = crypto.randomUUID();
  const dirs = node.directions
    ? `ARRAY[${node.directions.map(d => `'${d}'`).join(",")}]::direction[]`
    : `'{}'`;
  const name = node.name ? `'${node.name}'` : "NULL";

  sql += `INSERT INTO nodes (id, map_id, x, y, code, name, directions) VALUES ('${nodeId}', '${mapId}', ${node.x}, ${node.y}, ${node.code}, ${name}, ${dirs});\n`;

  if (node.charger) {
    sql += `INSERT INTO chargers (node_id, direction) VALUES ('${nodeId}', '${node.charger.direction}');\n`;
  }
  if (node.chute) {
    sql += `INSERT INTO chutes (node_id, direction) VALUES ('${nodeId}', '${node.chute.direction}');\n`;
  }
}

await Bun.write("db/002_seed.sql", sql);