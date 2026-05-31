# ---- Build Stage (shared between dev & prod) ----
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY homepage/package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# ---- Development Stage (hot-reload with Compose Watch) ----
FROM base AS development

# Copy source code (will be overwritten by Watch sync)
COPY homepage/ .

EXPOSE 3000

# Run Next.js in dev mode with hot reload
CMD ["npm", "run", "dev"]

# ---- Production Build ----
FROM base AS build

# Copy source code
COPY homepage/ .

# Build Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./

EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start"]