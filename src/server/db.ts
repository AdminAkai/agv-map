import { SQL } from "bun";

const db = new SQL({
  // this is established in compose yml
  url: process.env.DATABASE_URL,
  max: 10,
  idleTimeout: 30,
  maxLifetime: 3600,     
  onconnect: () => console.log("Connected to Postgres"),
});

export default db