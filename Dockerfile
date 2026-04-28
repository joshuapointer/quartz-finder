# syntax=docker/dockerfile:1.7

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://pillarpearl.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV ROLE=web
ENV PILLARPEARL_DB=/data/pillarpearl.db
ENV PILLARPEARL_IMAGE_DIR=/data/images

RUN apk add --no-cache wget libc6-compat \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone Next.js server (web role)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Worker role: tsx + source files + native deps for better-sqlite3.
# Placed under /app/worker so the worker has its own node_modules tree
# (Node's ESM resolver does not honour NODE_PATH).
COPY --from=builder --chown=nextjs:nodejs /app/node_modules /app/worker/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/src /app/worker/src
COPY --from=builder --chown=nextjs:nodejs /app/worker.mts /app/worker/worker.mts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json /app/worker/tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/worker/package.json
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh \
    && mkdir -p /data \
    && chown -R nextjs:nodejs /data /app/worker

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -q --spider http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
