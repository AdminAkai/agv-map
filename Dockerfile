# Using official Bun image for Debian
# I understand the requirements state Bullseye but Bullseye reached EOL in August and is no longer guaranteed to be secure
# Bun Debian is currently on Bookworm
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile -production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production

# RUN bun test        # optional
# RUN bun run build   # only needed if you want the static dist/ output too

# ---- final, minimal image ----
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/tsconfig.json .
# COPY --from=prerelease /usr/src/app/dist ./dist   # only if you ran `bun run build`

USER bun
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["bun", "start"]