FROM node:18 AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Update the package list
RUN apt-get update && apt-get install -y \
    libc6-dev \
    ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker
# RUN ls /app/out/ && sleep 60
# remove all empty node_modules folder structure
RUN rm -rf /app/out/full/*/*/node_modules

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN ls /app
RUN npm install -g pnpm
RUN pnpm install --shamefully-hoist

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo run build --filter=api

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/uploads/video

COPY --from=installer /app .

CMD  node apps/server/dist/main.js