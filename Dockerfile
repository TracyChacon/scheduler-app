# =====================================================================
# STAGE 1: DEPENDENCY INSTALLATION (Base)
# =====================================================================
FROM node:24.14.0-alpine AS base
WORKDIR /app

# Install system dependencies required for native module compilation if needed
RUN apk add --no-cache libc6-compat

# Copy package configuration files to leverage Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# =====================================================================
# STAGE 2: DEVELOPMENT RUNTIME (Target for local live coding)
# =====================================================================
FROM base AS development
WORKDIR /app

# Copy the rest of the application source code
COPY . .

# Set environment to development
ENV NODE_ENV=development
EXPOSE 3000

# Next.js development server with hot-reloading active
CMD ["npm", "run",  "dev"]

# =====================================================================
# STAGE 3: PRODUCTION BUILDER
# =====================================================================
FROM base AS builder
WORKDIR /app
COPY . .

# Disable Next.js telemetry during build phase
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile TypeScript and build production Next.js assets
RUN npm run build

# =====================================================================
# STAGE 4: HIGH-PERFORMANCE PRODUCTION RUNTIME
# =====================================================================
FROM node:24.14.0-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged system user for container security complience
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential runtime files from the build state
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Leverage Next.js standalone output tracing to copy only minimal execution boundares
# Note: To fully leverate standalone mode, ensure "output: 'standalone'" is inside next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nexjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]