# syntax=docker.io/docker/dockerfile:1
#
# 360TuongTac Marketing Website — Production Dockerfile
# Multi-stage build for Next.js 15 standalone output
# Target: ghcr.io/ngohuyhoanghcm/360tuongtac-marketing

# -----------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# -----------------------------------------------
# Stage 2: Builder
# -----------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Declare build arguments (only NEXT_PUBLIC_* needed at build time)
# Admin vars (NEXT_ADMIN_*) are injected at runtime via .env.prod on VPS
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GTM_ID

# Set environment variables for build (only public vars)
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
ENV NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# -----------------------------------------------
# Stage 3: Production Runner
# -----------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
