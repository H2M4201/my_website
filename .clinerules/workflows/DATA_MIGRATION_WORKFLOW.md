# Data Migration Workflow

> **Purpose:** A step-by-step guide for handling database schema changes in this project.  
> **Stack:** Prisma ORM (SQL Server) + Express backend + Next.js frontends (homepage + adminPage)  
> **Key Principle:** Every schema change requires **both** a database migration **and** corresponding code updates across all layers.  
> **Critical Constraints:**
> 1. **Never modify `backend/.env`** — Environment configuration is managed separately; manually editing `.env` can break local/dev environments.
> 2. **Never use "delete old and create new" for table schema updates** — Always use `ALTER TABLE` / additive migrations to **preserve existing data**. Dropping and recreating tables causes **permanent data loss**.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Layers Affected by Schema Changes](#2-architecture-layers-affected-by-schema-changes)
3. [Step-by-Step Migration Workflow](#3-step-by-step-migration-workflow)
4. [Code Modification Checklist](#4-code-modification-checklist)
5. [Real-World Example: Adding a Field](#5-real-world-example-adding-a-field)
6. [Real-World Example: Adding a New Model](#6-real-world-example-adding-a-new-model)
7. [Real-World Example: Renaming a Field](#7-real-world-example-renaming-a-field)
8. [Real-World Example: Removing a Field](#8-real-world-example-removing-a-field)
9. [Rollback Strategy](#9-rollback-strategy)
10. [Common Pitfalls](#10-common-pitfalls)
11. [Quick Reference Commands](#11-quick-reference-commands)

---

## 1. Overview

When the database schema changes (adding/removing/renaming fields, adding/removing models, changing relationships), you must update **all** of the following:

| Layer | Location | What to Update |
|-------|----------|----------------|
| **Prisma Schema** | `backend/prisma/schema.prisma` | Model definition |
| **Database** | SQL Server (via Prisma Migrate) | Actual DB tables/columns |
| **DTOs** | `backend/src/db/dtos/*.ts` | TypeScript interfaces for data transfer |
| **Services** | `backend/src/db/services/*.ts` | CRUD logic, mapping functions |
| **Zod Schemas** | `backend/src/api/schemas/index.ts` | Request/response validation |
| **API Routes** | `backend/src/api/routes/*.ts` | Route handlers (if new endpoints needed) |
| **Admin Page Types** | `adminPage/types/index.ts` | TypeScript interfaces for admin frontend |
| **Admin Page Components** | `adminPage/app/dashboard/*/page.tsx` | UI forms, tables, display |
| **Homepage API Client** | `homepage/lib/api.ts` | Fetch functions |
| **Homepage DTOs** | `homepage/lib/dto.ts` | TypeScript interfaces for homepage |
| **Homepage Components** | `homepage/app/*/page.tsx` | UI display components |

---

## 2. Architecture Layers Affected by Schema Changes

```
┌─────────────────────────────────────────────────────────────┐
│                    Prisma Schema                            │
│              backend/prisma/schema.prisma                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ prisma migrate dev
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQL Server Database                       │
│              (via Prisma Migrate)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐    ┌──────────────────────────┐
│   Backend Code   │    │   Frontend Code          │
│                  │    │                          │
│  • DTOs          │    │  • adminPage/types/      │
│  • Services      │    │  • adminPage components  │
│  • Zod Schemas   │    │  • homepage/lib/api.ts   │
│  • API Routes    │    │  • homepage/lib/dto.ts   │
│                  │    │  • homepage components   │
└──────────────────┘    └──────────────────────────┘
```

---

## 3. Step-by-Step Migration Workflow

### Phase 1: Plan & Analyze

- [ ] **Identify the change** — What field/model is being added, removed, or modified?
- [ ] **Check dependencies** — Does this affect other models (relations, foreign keys)?
- [ ] **Check existing data** — Are there rows in the DB that need to be migrated?
- [ ] **Determine nullability** — Can the new field be `NULL`? If not, what default value should existing rows get?
- [ ] **Verify `backend/.env` is untouched** — If you see changes to `.env` in `git diff`, revert them immediately (`.env` must never be committed or modified).
- [ ] **Verify migration approach preserves data** — The migration must use additive changes (`ALTER TABLE ADD` / `ALTER TABLE ALTER COLUMN`). Reject any approach that drops and recreates the table.

### Phase 2: Update Prisma Schema

- [ ] Edit `backend/prisma/schema.prisma` with the desired changes.
- [ ] Run `npm run prisma:generate:local` to regenerate the Prisma client.
- [ ] Run `npm run prisma:migrate:local` to create and apply the migration.
- [ ] Verify the migration SQL in `backend/prisma/migrations/<timestamp>_<name>/migration.sql`.

### Phase 3: Update Backend DTOs

- [ ] Edit the corresponding DTO file in `backend/src/db/dtos/`.
- [ ] Add/remove/rename fields in `*DTO`, `Create*DTO`, and `Update*DTO` interfaces.
- [ ] Update `backend/src/db/dtos/index.ts` if adding a new DTO file.

### Phase 4: Update Backend Services

- [ ] Edit the corresponding service file in `backend/src/db/services/`.
- [ ] Update the `map*ToDTO()` function to include/exclude the changed fields.
- [ ] Update `create()` and `update()` functions to handle the new/removed fields.
- [ ] Update `backend/src/db/services/index.ts` if adding a new service file.

### Phase 5: Update Zod Schemas

- [ ] Edit `backend/src/api/schemas/index.ts`.
- [ ] Update request schemas (`create*RequestSchema`, `update*RequestSchema`).
- [ ] Update response schemas (`*ResponseSchema`).
- [ ] Add new schemas if adding a new model.

### Phase 6: Update API Routes (if needed)

- [ ] Edit or create route files in `backend/src/api/routes/`.
- [ ] Register new routes in `backend/src/api/index.ts` or `backend/src/api/adminRoutes.ts`.

### Phase 7: Update Admin Page Types

- [ ] Edit `adminPage/types/index.ts`.
- [ ] Add/remove/rename fields in the corresponding interface.

### Phase 8: Update Admin Page Components

- [ ] Edit the corresponding page/component in `adminPage/app/dashboard/`.
- [ ] Update forms to include/exclude the changed fields.
- [ ] Update table/list displays to show/hide the changed fields.

### Phase 9: Update Homepage

- [ ] Edit `homepage/lib/dto.ts` to update the DTO interfaces.
- [ ] Edit `homepage/lib/api.ts` if adding new API functions.
- [ ] Edit `homepage/app/*/page.tsx` components to reflect the changes.

### Phase 10: Test

- [ ] Run `npm test` in the `backend/` directory.
- [ ] Manually test the API endpoints via the admin page.
- [ ] Verify the homepage renders correctly with the new data.
- [ ] Check that existing data is preserved and correctly mapped.

---

## 4. Code Modification Checklist

Use this checklist for **every** schema change:

### Backend (`backend/`)

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Update model definition |
| `src/db/dtos/<model>DTO.ts` | Update `*DTO`, `Create*DTO`, `Update*DTO` |
| `src/db/dtos/index.ts` | Export new DTOs if adding a new model |
| `src/db/services/<model>Service.ts` | Update `map*ToDTO()`, `create()`, `update()` |
| `src/db/services/index.ts` | Export new service if adding a new model |
| `src/api/schemas/index.ts` | Update request/response Zod schemas |
| `src/api/routes/<model>.routes.ts` | Update route handlers if needed |
| `src/api/index.ts` | Register new routes if adding a new model |

### Admin Page (`adminPage/`)

| File | Action |
|------|--------|
| `types/index.ts` | Update TypeScript interface |
| `app/dashboard/<model>/page.tsx` | Update UI components |

### Homepage (`homepage/`)

| File | Action |
|------|--------|
| `lib/dto.ts` | Update DTO interfaces |
| `lib/api.ts` | Update fetch functions |
| `app/<model>/page.tsx` | Update UI components |

---

## 5. Real-World Example: Adding a Field

**Scenario:** Add a `SortOrder` field to the `Blog` model.

### Step 1: Update Prisma Schema

```prisma
// backend/prisma/schema.prisma
model Blog {
  id          Int      @id @default(autoincrement())
  Title       String   @db.NVarChar(255)
  Description String?  @db.NVarChar(1000)
  Content     String?  @db.NVarChar(max)
  SortOrder   Int      @default(0)          // ← NEW FIELD
  IsActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("Blog")
}
```

### Step 2: Run Migration

```bash
cd backend
npm run prisma:migrate:local
```

### Step 3: Update DTO

```typescript
// backend/src/db/dtos/blogDTO.ts
export interface BlogDTO {
  id: number
  title: string
  description: string | null
  content: string | null
  sortOrder: number          // ← NEW FIELD
  isActive: boolean
}

export interface CreateBlogDTO {
  title: string
  description?: string | null
  content?: string | null
  sortOrder?: number         // ← NEW FIELD (optional on create)
  isActive?: boolean
}

export interface UpdateBlogDTO {
  title?: string
  description?: string | null
  content?: string | null
  sortOrder?: number         // ← NEW FIELD (optional on update)
  isActive?: boolean
}
```

### Step 4: Update Service

```typescript
// backend/src/db/services/blogsService.ts
function mapBlogToDTO(blog: {
  id: number
  Title: string
  Description: string | null
  Content: string | null
  SortOrder: number          // ← NEW FIELD
  IsActive: boolean
}): BlogDTO {
  return {
    id: blog.id,
    title: blog.Title,
    description: blog.Description,
    content: blog.Content,
    sortOrder: blog.SortOrder,  // ← NEW FIELD
    isActive: blog.IsActive,
  }
}

// In createBlog():
data: {
  Title: data.title,
  Description: data.description || null,
  Content: data.content || null,
  SortOrder: data.sortOrder ?? 0,  // ← NEW FIELD
  IsActive: data.isActive ?? true,
},

// In updateBlog():
SortOrder: data.sortOrder !== undefined ? data.sortOrder : blog.SortOrder,  // ← NEW FIELD
```

### Step 5: Update Zod Schemas

```typescript
// backend/src/api/schemas/index.ts
export const createBlogRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),  // ← NEW FIELD
  isActive: z.boolean().optional(),
})

export const updateBlogRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),  // ← NEW FIELD
  isActive: z.boolean().optional(),
})

export const blogResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string().nullable(),
  sortOrder: z.number(),  // ← NEW FIELD
  isActive: z.boolean(),
})
```

### Step 6: Update Admin Page Types

```typescript
// adminPage/types/index.ts
export interface Blog {
  id: number
  title: string
  description: string | null
  content: string | null
  sortOrder: number  // ← NEW FIELD
}
```

### Step 7: Update Admin Page Component

```typescript
// adminPage/app/dashboard/blogs/page.tsx (example snippet)
// Add sortOrder to form fields and table columns
```

### Step 8: Update Homepage DTO

```typescript
// homepage/lib/dto.ts
export interface BlogDTO {
  id: number
  title: string
  description: string | null
  content: string | null
  sortOrder: number  // ← NEW FIELD
  isActive: boolean
}
```

---

## 6. Real-World Example: Adding a New Model

**Scenario:** Add a `Tag` model with a many-to-many relationship to `Blog`.

### Step 1: Update Prisma Schema

```prisma
// backend/prisma/schema.prisma
model Tag {
  id        Int      @id @default(autoincrement())
  Name      String   @db.NVarChar(100)
  IsActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  blogs BlogTag[]

  @@map("Tag")
}

model BlogTag {
  blogId Int
  tagId  Int

  blog Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([blogId, tagId])
  @@map("BlogTag")
}

// Also update Blog model to add the relation:
model Blog {
  // ... existing fields ...
  tags BlogTag[]
}
```

### Step 2: Run Migration

```bash
cd backend
npm run prisma:migrate:local
```

### Step 3: Create DTO

```typescript
// backend/src/db/dtos/tagDTO.ts
export interface TagDTO {
  id: number
  name: string
  isActive: boolean
}

export interface CreateTagDTO {
  name: string
  isActive?: boolean
}

export interface UpdateTagDTO {
  name?: string
  isActive?: boolean
}

export class TagNotFoundError extends Error {
  constructor(id: number) {
    super(`Tag with id ${id} not found`)
    this.name = 'TagNotFoundError'
  }
}
```

### Step 4: Update DTO Index

```typescript
// backend/src/db/dtos/index.ts
export * from './tagDTO'  // ← NEW
```

### Step 5: Create Service

```typescript
// backend/src/db/services/tagsService.ts
import { prisma } from '../prisma'
import { TagDTO, CreateTagDTO, UpdateTagDTO, TagNotFoundError } from '../dtos'

function mapTagToDTO(tag: {
  id: number
  Name: string
  IsActive: boolean
}): TagDTO {
  return {
    id: tag.id,
    name: tag.Name,
    isActive: tag.IsActive,
  }
}

export async function getAllTags(): Promise<TagDTO[]> {
  const tags = await prisma.tag.findMany({ orderBy: { id: 'asc' } })
  return tags.map(mapTagToDTO)
}

export async function getTagById(id: number): Promise<TagDTO> {
  const tag = await prisma.tag.findUnique({ where: { id } })
  if (!tag) throw new TagNotFoundError(id)
  return mapTagToDTO(tag)
}

export async function createTag(data: CreateTagDTO): Promise<TagDTO> {
  const tag = await prisma.tag.create({
    data: {
      Name: data.name,
      IsActive: data.isActive ?? true,
    },
  })
  return mapTagToDTO(tag)
}

export async function updateTag(id: number, data: UpdateTagDTO): Promise<TagDTO> {
  const tag = await prisma.tag.findUnique({ where: { id } })
  if (!tag) throw new TagNotFoundError(id)

  const updated = await prisma.tag.update({
    where: { id },
    data: {
      Name: data.name !== undefined ? data.name : tag.Name,
      IsActive: data.isActive !== undefined ? data.isActive : tag.IsActive,
    },
  })
  return mapTagToDTO(updated)
}

export async function deleteTag(id: number): Promise<void> {
  const tag = await prisma.tag.findUnique({ where: { id } })
  if (!tag) throw new TagNotFoundError(id)
  await prisma.tag.delete({ where: { id } })
}
```

### Step 6: Update Service Index

```typescript
// backend/src/db/services/index.ts
export * from './tagsService'  // ← NEW
```

### Step 7: Add Zod Schemas

```typescript
// backend/src/api/schemas/index.ts
export const tagIdParamSchema = z.coerce.number().positive()

export const createTagRequestSchema = z.object({
  name: z.string().min(1).max(100),
  isActive: z.boolean().optional(),
})

export const updateTagRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
})

export const tagResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
})

export const tagsListResponseSchema = z.array(tagResponseSchema)
```

### Step 8: Create API Routes

```typescript
// backend/src/api/routes/tags.routes.ts
import { Router } from 'express'
import { z } from 'zod'
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  TagNotFoundError,
} from '../../db'
import {
  tagIdParamSchema,
  tagsListResponseSchema,
  createTagRequestSchema,
  updateTagRequestSchema,
  tagResponseSchema,
} from '../schemas'

export const tagsRouter = Router()

tagsRouter.get('/', async (_req, res) => {
  try {
    const tags = await getAllTags()
    const validated = tagsListResponseSchema.parse(tags)
    res.json(validated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' })
  }
})

tagsRouter.get('/:id', async (req, res) => {
  try {
    const id = tagIdParamSchema.parse(req.params.id)
    const tag = await getTagById(id)
    res.json(tag)
  } catch (error) {
    if (error instanceof TagNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch tag' })
  }
})

tagsRouter.post('/', async (req, res) => {
  try {
    const data = createTagRequestSchema.parse(req.body)
    const tag = await createTag(data)
    const validated = tagResponseSchema.parse(tag)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to create tag' })
  }
})

tagsRouter.patch('/:id', async (req, res) => {
  try {
    const id = tagIdParamSchema.parse(req.params.id)
    const data = updateTagRequestSchema.parse(req.body)
    const tag = await updateTag(id, data)
    const validated = tagResponseSchema.parse(tag)
    res.json(validated)
  } catch (error) {
    if (error instanceof TagNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to update tag' })
  }
})

tagsRouter.delete('/:id', async (req, res) => {
  try {
    const id = tagIdParamSchema.parse(req.params.id)
    await deleteTag(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof TagNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to delete tag' })
  }
})
```

### Step 9: Register Routes

```typescript
// backend/src/api/index.ts
import { tagsRouter } from './routes/tags.routes'
app.use('/api/v1/tags', tagsRouter)
```

### Step 10: Update Admin Page Types

```typescript
// adminPage/types/index.ts
export interface Tag {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ResourceType =
  | 'section'
  | 'contact'
  | 'blog'
  | 'trip'
  | 'recipe'
  | 'ingredient'
  | 'resume'
  | 'experience'
  | 'expertise'
  | 'job-description'
  | 'user'
  | 'role'
  | 'permission'
  | 'tag'  // ← NEW
```

### Step 11: Update Homepage

```typescript
// homepage/lib/dto.ts
export interface TagDTO {
  id: number
  name: string
  isActive: boolean
}

// homepage/lib/api.ts
export async function getAllTags(): Promise<TagDTO[]> {
  const url = `${getApiBaseUrl()}/api/v1/tags`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: DEFAULT_REVALIDATION },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch tags`)
  return response.json()
}
```

---

## 7. Real-World Example: Renaming a Field

**Scenario:** Rename `Description` to `Summary` in the `Trip` model.

> ⚠️ **Prisma does not support field renaming natively.** You must:
> 1. Add the new field
> 2. Write a data migration to copy values
> 3. Remove the old field

### Step 1: Update Prisma Schema (Two-Step)

**First migration — Add the new field:**

```prisma
model Trip {
  id          Int      @id @default(autoincrement())
  Title       String   @db.NVarChar(255)
  Description String?  @db.NVarChar(1000)   // ← OLD (keep for now)
  Summary     String?  @db.NVarChar(1000)   // ← NEW FIELD
  Time        String?  @db.NVarChar(100)
  Location    String?  @db.NVarChar(255)
  Content     String?  @db.NVarChar(max)
  IsActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("Trip")
}
```

### Step 2: Run First Migration

```bash
cd backend
npm run prisma:migrate:local
```

### Step 3: Write a Data Migration Script

```typescript
// backend/scripts/migrate-trip-description-to-summary.ts
import { prisma } from '../src/db/prisma'

async function main() {
  console.log('Migrating Trip.Description → Trip.Summary...')

  const trips = await prisma.trip.findMany({
    where: { Summary: null, Description: { not: null } },
  })

  for (const trip of trips) {
    await prisma.trip.update({
      where: { id: trip.id },
      data: { Summary: trip.Description },
    })
  }

  console.log(`Updated ${trips.length} trips.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
cd backend
npx tsx scripts/migrate-trip-description-to-summary.ts
```

### Step 4: Remove the Old Field

```prisma
model Trip {
  id          Int      @id @default(autoincrement())
  Title       String   @db.NVarChar(255)
  // Description String?  @db.NVarChar(1000)  // ← REMOVED
  Summary     String?  @db.NVarChar(1000)   // ← KEEP
  Time        String?  @db.NVarChar(100)
  Location    String?  @db.NVarChar(255)
  Content     String?  @db.NVarChar(max)
  IsActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("Trip")
}
```

### Step 5: Run Second Migration

```bash
cd backend
npm run prisma:migrate:local
```

### Step 6: Update All Code Layers

Update DTOs, services, Zod schemas, admin types, homepage DTOs — replace `description` with `summary` everywhere.

---

## 8. Real-World Example: Removing a Field

**Scenario:** Remove the `Icon` field from the `Contact` model.

### Step 1: Update Prisma Schema

```prisma
model Contact {
  id          Int      @id @default(autoincrement())
  ContactType String   @db.NVarChar(50)
  ContactInfo String   @db.NVarChar(255)
  // Icon        String?  @db.NVarChar(100)  // ← REMOVED
  IsActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("Contact")
}
```

### Step 2: Run Migration

```bash
cd backend
npm run prisma:migrate:local
```

### Step 3: Update DTO

```typescript
// backend/src/db/dtos/contactDTO.ts
export interface ContactDTO {
  id: number
  type: string
  info: string
  // icon: string | null  // ← REMOVED
  isActive: boolean
}

export interface CreateContactDTO {
  type: string
  info: string
  // icon?: string | null  // ← REMOVED
  isActive?: boolean
}

export interface UpdateContactDTO {
  type?: string
  info?: string
  // icon?: string | null  // ← REMOVED
  isActive?: boolean
}
```

### Step 4: Update Service

```typescript
// backend/src/db/services/contactsService.ts
function mapContactToDTO(contact: {
  id: number
  ContactType: string
  ContactInfo: string
  // Icon: string | null  // ← REMOVED
  IsActive: boolean
}): ContactDTO {
  return {
    id: contact.id,
    type: contact.ContactType,
    info: contact.ContactInfo,
    // icon: contact.Icon,  // ← REMOVED
    isActive: contact.IsActive,
  }
}

// In createContact():
data: {
  ContactType: data.type,
  ContactInfo: data.info,
  // Icon: data.icon || null,  // ← REMOVED
  IsActive: data.isActive ?? true,
},

// In updateContact():
// Icon: data.icon !== undefined ? data.icon : contact.Icon,  // ← REMOVED
```

### Step 5: Update Zod Schemas

```typescript
// backend/src/api/schemas/index.ts
export const createContactRequestSchema = z.object({
  type: z.string().min(1).max(50),
  info: z.string().min(1).max(255),
  // icon: z.string().nullable().optional(),  // ← REMOVED
  isActive: z.boolean().optional(),
})

export const updateContactRequestSchema = z.object({
  type: z.string().min(1).max(50).optional(),
  info: z.string().min(1).max(255).optional(),
  // icon: z.string().nullable().optional(),  // ← REMOVED
  isActive: z.boolean().optional(),
})

export const contactResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  info: z.string(),
  // icon: z.string().nullable(),  // ← REMOVED
  isActive: z.boolean(),
})
```

### Step 6: Update Admin Page Types

```typescript
// adminPage/types/index.ts
export interface Contact {
  id: number
  type: string
  info: string
  // icon: string | null  // ← REMOVED
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### Step 7: Update Admin Page Component

Remove the `icon` field from forms and table displays in `adminPage/app/dashboard/contacts/page.tsx`.

### Step 8: Update Homepage DTO

```typescript
// homepage/lib/dto.ts
export interface ContactDTO {
  id: number
  type: string
  info: string
  // icon: string | null  // ← REMOVED
  isActive: boolean
}
```

---

## 9. Rollback Strategy

### If the migration has NOT been applied to production:

```bash
cd backend
# Reset the local database
npx prisma migrate reset

# Or rollback the last migration
npx prisma migrate dev --name <previous_migration_name>
```

### If the migration HAS been applied to production:

1. **Revert the Prisma schema** to the previous state.
2. **Create a new migration** that reverses the changes:

```bash
cd backend
npm run prisma:migrate:local
```

3. **Write a data migration script** if data needs to be restored (e.g., copying values back from a backup column).
4. **Revert all code changes** (DTOs, services, schemas, frontend types/components).
5. **Deploy the rollback.**

### Full Rollback Example:

```bash
# 1. Revert schema.prisma to previous state (git checkout or manual edit)

# 2. Create a new migration that reverses the changes
cd backend
npm run prisma:migrate:local

# 3. Revert all code changes
git checkout -- src/db/dtos/ src/db/services/ src/api/schemas/ src/api/routes/
git checkout -- ../adminPage/types/ ../homepage/lib/

# 4. Regenerate Prisma client
npm run prisma:generate:local
```

---

## 10. Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Modifying `backend/.env` during migration** | Never edit `.env` — environment config is managed separately. Revert any accidental `.env` changes before committing |
| **Dropping and recreating a table instead of altering it** | Always use additive migrations (`ALTER TABLE ADD COLUMN`, etc.). Dropping + recreating wipes all existing data permanently |
| **Forgetting to update DTOs** | Always check `backend/src/db/dtos/` after schema changes |
| **Forgetting to update Zod schemas** | API will accept/return wrong data shapes |
| **Forgetting to update adminPage types** | TypeScript errors in admin frontend |
| **Forgetting to update homepage DTOs** | TypeScript errors in homepage frontend |
| **Nullable vs non-nullable mismatch** | Ensure DTO, Zod schema, and Prisma types agree on nullability |
| **Not handling existing data** | New non-nullable fields need defaults; renamed fields need data migration |
| **Skipping `prisma generate`** | Prisma client won't reflect schema changes |
| **Running migration without backup** | Always backup production DB before running migrations |
| **Not testing both frontends** | Changes may work in admin but break homepage (or vice versa) |
| **Forgetting to update `@@map()`** | Table name mapping must match existing DB table names |

---

## 11. Quick Reference Commands

```bash
# === Backend (run from backend/ directory) ===

# Regenerate Prisma client (local SQL Server)
npm run prisma:generate:local

# Create and apply a new migration (local SQL Server)
npm run prisma:migrate:local

# Reset database (drops all data and re-applies all migrations)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# === CRITICAL: Verify migration SQL for data safety ===
# Always review migration.sql — ensure it uses ALTER TABLE, not DROP TABLE + CREATE TABLE
# grep for "DROP TABLE" in migration SQL — if present, reject the migration
grep -i "drop table\|drop  table" backend/prisma/migrations/*/migration.sql || echo "OK - no DROP TABLE found"
#
# Also verify .env was NOT modified by the migration process:
git diff --name-only | grep -i "\.env$" && echo "WARNING: .env was modified! Revert immediately." || echo "OK - .env untouched"

# Run a data migration script
npx tsx scripts/<script-name>.ts

# Run backend tests
npm test

# === Docker (run from project root) ===

# Rebuild and restart backend after schema changes
docker-compose up -d --build backend

# Run Prisma migration inside Docker container
docker-compose exec backend npx prisma migrate dev
```

---

> **Last Updated:** 2026-06-02  
> **Maintainer:** Backend Team