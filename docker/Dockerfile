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
RUN pnpm run build

## nextjs standolone not working
# RUN pnpm deploy --filter=web --prod /prod/web

RUN pnpm deploy --filter=server --prod /prod/server

FROM base AS server

WORKDIR /app
COPY --from=build /prod/server /app/apps/server
RUN mkdir -p /app/uploads
RUN mkdir -p /app/uploads/video
CMD node /app/apps/server/dist/main.js

FROM base AS web
WORKDIR /app

COPY --from=build /app/apps/web/next.config.js .
COPY --from=build /app/apps/web/package.json .

COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/server ./apps/web/.next/server
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js