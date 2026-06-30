# Architecture & Data Flow

This document describes the data flow between the three services and important design decisions. Updated when significant architecture changes are made.

## Services

| Service | Port | Framework | Purpose |
|---------|------|-----------|---------|
| **backend** | 4000 | Express + Prisma | REST API, PostgreSQL data access |
| **homepage** | 3000 | Next.js 14 (App Router) | Public-facing portfolio site |
| **adminPage** | 5000 | Next.js 14 (App Router) | Admin dashboard for content management |

---

## Data Update Flow

```
┌──────────┐  POST/PATCH/DELETE (mutation)  ┌──────────┐
│ adminPage│ ──────────────────────────────>│ backend  │
│ port 5000│                                 │ port 4000│
│          │                                 │          │
│  ┌────┐  │  mutate() → re-fetch via SWR   │   Prisma │──> PostgreSQL
│  │ SWR│<─│  GET /api/v1/admin/{resource}  │          │
│  └────┘  │  (no-store, always fresh)      │          │
└──────────┘                                 └────┬─────┘
                                                 │
              revalidateFrontendCaches()          │
              POST /api/revalidate {secret, tag}  │
              Both HTTP & HTTPS, Promise.allSettled
                                                 │
┌──────────┐  <──────────────────────────────────┘
│ homepage │
│ port 3000│
│          │  /api/revalidate receives POST
│  Next.js │  → revalidateTag(tag)      (purges Data Cache)
│  Data    │  → revalidatePath("/")     (purges Route Cache)
│  Cache   │
│          │  SSR fetch() with next: { tags, revalidate: 5 }
│          │  → 5s TTL as fallback if webhook fails
└──────────┘
```

---

## Caching & Revalidation

### Backend → Frontend revalidation webhook

When admin creates/updates/deletes data, the backend calls `revalidateFrontendCaches(resource)` which POSTs to every frontend's `/api/revalidate` endpoint with a shared `REVALIDATION_SECRET`. The frontend then purges its Next.js Data Cache for the corresponding tag.

- **Shared secret**: `REVALIDATION_SECRET` must match across backend, homepage, and adminPage `.env` files
- **Transport**: Both HTTP and HTTPS are attempted for each frontend URL (handles self-signed certs in dev)
- **Tag mapping** (`backend/src/api/adminRoutes.ts`):

| Resource | Cache Tag |
|----------|-----------|
| section | `sections` |
| contact | `contacts` |
| blog | `blogs` |
| trip | `trips` |
| recipe | `recipes` |
| ingredient | `ingredients` |
| experience | `resume` |
| expertise | `resume` |
| job-description | `resume` |

### Homepage caching

All homepage SSR pages use `dynamic = 'force-dynamic'` (no static generation). Each `fetch()` uses `next: { tags, revalidate: 5 }`. The 5-second TTL is a safety net — the revalidation webhook purges the cache immediately on admin mutations.

### AdminPage caching

AdminPage uses **SWR** for data fetching with `cache: 'no-store'` on all `fetch()` calls. After every mutation, `mutate()` triggers an immediate re-fetch. No Next.js Data Cache is involved for admin reads.

### Backend response headers

All GET endpoints return `Cache-Control: no-store` to prevent browsers, proxies, and CDNs from serving stale data.

---

## Active/Inactive Filtering

The homepage should only display **active** items. The admin should see **all** items.

### Service layer

Each entity has two `getAll` functions:

| Function | Filter | Used by |
|----------|--------|---------|
| `getAll*()` | `where: { IsActive: true }` | Public endpoints (homepage) |
| `getAll*IncludingInactive()` | No filter | Admin endpoints (adminPage) |

Implementation:
- **Generic CRUD entities** (sections, contacts, blogs, trips, recipes, ingredients): `crudService.ts` provides both `getAll()` (filtered) and `getAllIncludingInactive()` (unfiltered)
- **Resume entities** (experiences, expertise, job descriptions): `resumeService.ts` provides both variants

### Route layer

| Endpoint | Service function | Shows inactive? |
|----------|-----------------|-----------------|
| `GET /api/v1/sections` | `getAllSections()` | No |
| `GET /api/v1/admin/section` | `getAllSectionsIncludingInactive()` | Yes |
| `GET /api/v1/resume/experiences` | `getAllExperiences(false)` | No |
| `GET /api/v1/resume/expertise` | `getAllExpertiseCategories()` | No |
| `GET /api/v1/admin/expertise` | `getAllExpertiseCategoriesIncludingInactive()` | Yes |

### Frontend reads

| Frontend | Read endpoint | Sees |
|----------|--------------|------|
| Homepage SSR | `/api/v1/{resource}s`, `/api/v1/resume/*` | Active only |
| AdminPage SWR | `/api/v1/admin/{resource}` | All |

---

## Revision History

### 2026-06-26 — Active/Inactive Filtering & Caching Fix
- Added `where: { IsActive: true }` to all public `getAll()` service functions
- Added `getAll*IncludingInactive()` variants for admin endpoints
- Switched adminPage SWR reads from public (`/api/v1/{resource}s`) to admin (`/api/v1/admin/{resource}`) endpoints
- Fixed `REVALIDATION_SECRET` mismatch between backend and frontends
- Changed backend GET response headers from `Cache-Control: public, max-age=300` to `Cache-Control: no-store`
- Added `cache: 'no-store'` to adminPage SWR fetcher
- Added HTTP fallback to revalidation webhook (tries both HTTP and HTTPS)
- Reduced homepage Next.js Data Cache TTL from 15s to 5s
