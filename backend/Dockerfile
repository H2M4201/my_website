# ---- Build Stage (shared between dev & prod) ----
FROM node:20-alpine AS base

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# ---- Development Stage (hot-reload with Compose Watch) ----
FROM base AS development

# Copy entire source code (will be overwritten by Watch sync)
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

# Run dev server with hot reload
CMD ["npx", "tsx", "watch", "src/index.ts"]

# ---- Production Build ----
FROM base AS build

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy built artifacts and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 4000

# Start the server
CMD ["node", "dist/index.js"]