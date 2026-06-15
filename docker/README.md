# Docker Setup for My Website

This directory contains Docker configuration files to containerize the three modules of the portfolio website:

| Module     | Description            | Port | Dockerfile                  |
|------------|------------------------|------|-----------------------------|
| **homepage**  | Public-facing website  | 3000 | `homepage/Dockerfile`         |
| **adminPage** | Admin dashboard        | 5000 | `adminPage/Dockerfile`        |
| **backend**   | API server (Express)   | 4000 | `backend/Dockerfile`          |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- A Supabase project (for PostgreSQL database in production)

## Quick Start

### 1. Configure Environment

Copy the Docker environment template and fill in your Supabase credentials:

```bash
cp docker/.env.docker docker/.env.docker.local
# Edit docker/.env.docker.local with your Supabase connection string
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose --env-file docker/.env.docker.local up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access the Services

- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:5000
- **Backend API**: http://localhost:4000

## Database Configuration

### Docker / Production (Supabase PostgreSQL)

The `docker-compose.yml` overrides the `DATABASE_URL` environment variable with the Supabase PostgreSQL connection string from `docker/.env.docker`.

The Prisma schema (`backend/prisma/schema.prisma`) uses the `postgresql` provider by default, which is compatible with Supabase.

### Local Development (SQL Server)

For local development without Docker, the backend uses SQL Server via the `DATABASE_URL` in `backend/.env`.

To generate the Prisma client for SQL Server:

```bash
cd backend
npm run prisma:generate:local
```

This temporarily switches the schema to SQL Server, generates the client, then restores the PostgreSQL schema.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  homepage    │     │  adminPage  │     │   backend   │
│  (Next.js)   │     │  (Next.js)  │     │  (Express)  │
│  port 3000   │     │  port 5000  │     │  port 4000  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Supabase   │
                    │ PostgreSQL  │
                    └─────────────┘
```

- The frontend services (`homepage`, `adminPage`) communicate with the `backend` via Docker's internal network using service names (`http://backend:4000`).
- The `backend` connects to Supabase PostgreSQL using the connection string from the environment.
- All services are on the same Docker network (`mywebsite-network`).

## Building Individual Images

To build and run a single service:

```bash
# Build backend only
docker build -f backend/Dockerfile -t mywebsite-backend ./backend

# Build homepage only
docker build -f homepage/Dockerfile -t mywebsite-homepage ./homepage

# Build adminPage only
docker build -f adminPage/Dockerfile -t mywebsite-admin ./adminPage
```

## Troubleshooting

### Prisma Client Generation

If you see Prisma client errors in the backend container, ensure the Prisma client was generated during the Docker build. The Dockerfile runs `npx prisma generate` as part of the build process.

### Database Connection Issues

1. Verify your Supabase connection string in `docker/.env.docker.local`
2. Ensure your Supabase project allows connections from your IP (check Supabase dashboard → Settings → Database → Connection pooling)
3. Check the backend logs: `docker-compose logs backend`

### CORS Issues

The backend is configured to accept requests from:
- `http://localhost:3000`, `http://localhost:5000` (browser access)
- `http://homepage:3000`, `http://adminPage:5000` (Docker internal network)