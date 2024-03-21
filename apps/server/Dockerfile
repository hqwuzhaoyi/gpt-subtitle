FROM node:18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo

FROM base AS prod-deps

RUN apt-get update && apt-get install -y libc6-dev ffmpeg git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN turbo prune --scope=server --docker
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=prod-deps /app/out/json/ .
COPY --from=prod-deps /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/out/full/ .
COPY turbo.json turbo.json

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm turbo run build --filter=api
RUN pnpm deploy --filter=server --prod server

FROM base AS runner
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


RUN mkdir -p /app/uploads/
COPY --from=build /app .

CMD  node apps/server/dist/main.js
