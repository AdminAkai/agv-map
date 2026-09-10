# i understand the requirements state Bullseye but Bullseye reached EOL in August and is no longer guaranteed to be secure
# Bun Debian is currently on Bookworm
FROM debian:bookworm AS base
# need to get curl and unzip and ca-certificates on bare image since they arent there by default
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl unzip ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# Bun install defaults to root rather than somewhere shared for the Bun user (and optionally other users) to access
ENV BUN_INSTALL=/usr/local/share/bun
RUN curl -fsSL https://bun.com/install | bash
# need to let docker know the path for Bun so Bun commands work here onward, use BUN_INSTALL path
ENV PATH="${BUN_INSTALL}/bin:${PATH}"
# need to create group bun with user bun (same namecasing cuz lazy) because that's what Bun does on its official image
# added bonus, just part of general least privilege practice with container security in the weird scenario that this little project has a vulnerability
RUN groupadd --gid 1001 bun && useradd --uid 1001 --gid bun --shell /bin/bash --create-home bun
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY --chown=bun:bun package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY --chown=bun:bun package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --chown=bun:bun --from=install /temp/dev/node_modules node_modules
COPY --chown=bun:bun . .
ENV NODE_ENV=production

# RUN bun test        # optional
# RUN bun run build   # only needed if you want the static dist/ output too

# ---- final, minimal image ----
FROM base AS release
COPY --chown=bun:bun --from=install /temp/prod/node_modules node_modules
COPY --chown=bun:bun --from=prerelease /usr/src/app/src ./src
COPY --chown=bun:bun --from=prerelease /usr/src/app/package.json .
COPY --chown=bun:bun --from=prerelease /usr/src/app/tsconfig.json .

USER bun
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["bun", "start"]