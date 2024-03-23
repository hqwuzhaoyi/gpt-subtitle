FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo

FROM base AS build
RUN apt-get update && apt-get install -y libc6-dev ffmpeg git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm turbo run build --filter=server
RUN pnpm deploy --filter=server --prod /prod/server

FROM base AS server
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
RUN mkdir -p /prod/server/uploads/
CMD  node /prod/server/dist/main.js
