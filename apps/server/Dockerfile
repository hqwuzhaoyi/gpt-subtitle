FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo
RUN apt-get update && apt-get install -y libc6-dev ffmpeg git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM base AS build

COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=server
RUN pnpm deploy --filter=server --prod /prod/server

FROM base AS server

WORKDIR /app
COPY --from=build /prod/server /app/apps/server
RUN mkdir -p /app/uploads
RUN mkdir -p /app/uploads/video
CMD node /app/apps/server/dist/main.js