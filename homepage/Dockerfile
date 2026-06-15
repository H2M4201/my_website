# ---- Build Stage (shared between dev & prod) ----
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# ---- Development Stage (hot-reload with Compose Watch) ----
FROM base AS development

# Copy source code (will be overwritten by Watch sync)
COPY . .

EXPOSE 3000

# Run with HTTPS via custom server.js
CMD ["npm", "run", "dev:ssl"]

# ---- Production Build ----
FROM base AS build

# Accept build-time API URL (default from endpoints.ts)
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy source code
COPY . .

# Build Next.js app (gracefully handles missing API for generateStaticParams)
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL for self-signed certificate generation on startup
RUN apk add --no-cache openssl

# Copy built artifacts
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./

# Copy server.js for HTTPS serving
COPY --from=build /app/server.js ./server.js

EXPOSE 3000

# Start with Next.js built-in HTTP server (Docker handles networking internally)
CMD ["npm", "run", "start"]