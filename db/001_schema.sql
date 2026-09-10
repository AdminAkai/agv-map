CREATE TYPE direction AS ENUM ('North', 'South', 'East', 'West');

CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  max_neighbor_distance INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  code INTEGER NOT NULL,
  name TEXT,
  directions direction[] NOT NULL DEFAULT '{}',
  UNIQUE (map_id, code)
);

CREATE TABLE chargers (
  node_id UUID PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
  direction direction NOT NULL
);

CREATE TABLE chutes (
  node_id UUID PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
  direction direction NOT NULL
);