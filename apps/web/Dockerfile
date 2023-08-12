FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker
# RUN ls /app/out/ && sleep 60

# remove all empty node_modules folder structure
RUN rm -rf /app/out/full/*/*/node_modules

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install --shamefully-hoist

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# 设置默认值
ARG WEB_PORT=3000
ARG SERVER_PORT=3001
ARG API_URL=http://localhost:3001
ARG STATIC_PATH=/static

# 将 ARG 的值赋给 ENV
ENV WEB_PORT=$WEB_PORT
ENV SERVER_PORT=$SERVER_PORT

ENV API_URL=$API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL
ENV STATIC_PATH=$STATIC_PATH


RUN pnpm turbo run build --filter=web

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/server ./apps/web/.next/server
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static  ./.next/static

CMD node apps/web/server.js