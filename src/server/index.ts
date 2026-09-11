import { serve } from "bun";
import { createYoga } from 'graphql-yoga'

import index from "../app/index.html";
import schema from "./schema";
import db from "./db";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql"
})

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/graphql": yoga,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/healthz": async () => {
      try {
        await db`SELECT 1`;
        return Response.json({ status: "ok" });
      } catch (err) {
        return Response.json({ status: "error" }, { status: 503 });
      }
    }
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
