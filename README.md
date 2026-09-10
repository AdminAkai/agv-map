# AGV (Automated Guided Vehicle) Map

Built in Bun (my first time using), significantly faster than Node as it uses JavascriptCore engine rather than V8
Although, in a real world application this giant performance gap narrows since database and routing layers are involved (https://strapi.io/blog/bun-vs-nodejs-performance-comparison-guide)
Performance aside though, Bun's native support for Typescript and many other layers (like PostgreSQL) make it ideal and something I want to move to anyway
As a bonus though, Bun HAS Node compatibility, and can be a drop-in replacement for Node, really impressive stuff

# Assumptions
 Since I can't ask questions, the data was built on some assumptions:
 - For now, I built it under the assumption that it is a single map editor, multiple maps are not supported but CAN be with some flexible adjustment,
 with that being said that's why you'll see mapId to a hardcoded string
 - The "directions" property is an enum rather than a junction table under the assumption that directions doesn't need metadata,
 and because AGV cannot travel diagonally intercardinal directions are not included in this enum

# Database Seeding
 - Schema and seed for postgres are under db
 - Script for generating seed and dummy data from assessment under scripts (already generated, nothing to be done)

# For first time running or for a fresh database:
docker compose down -v
docker compose up --build

# Stop/resume without messing with data:
docker compose stop
docker compose start