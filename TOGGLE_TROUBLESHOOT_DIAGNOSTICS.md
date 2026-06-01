# Active Toggle Troubleshooting Diagnostics

## The Issue
- **Experiences page**: Active toggle ✅ visible and functional
- **Expertise page**: Active toggle ❌ NOT visible
- Other screens (Section, Contact, Trip, Recipe): same expertise pattern ❌

## Root Cause Analysis

The toggle shows/hides based on Table.tsx line 48-49:

```ts
const hasIsActiveField = data.some((item) => 'isActive' in item)
```

If the API response items **do not have `isActive` as a property**, the toggle column is hidden.

## Layer-by-Layer Comparison

### 1️⃣ Prisma Schema (Database - both have `IsActive` column ✅)

| Model | Has IsActive? |
|-------|:------------:|
| `Experience` | ✅ `IsActive Boolean @default(true)` |
| `ExpertiseCategory` | ✅ `IsActive Boolean @default(true)` |

### 2️⃣ Backend DTOs (`backend/src/db/dtos/resumeDTO.ts`)

| DTO | Has `isActive`? |
|-----|:--------------:|
| `ExperienceDTO` | ✅ `isActive: boolean` |
| `CreateExperienceDTO` | ✅ `isActive?: boolean` |
| `UpdateExperienceDTO` | ✅ `isActive?: boolean` |
| `ExpertiseCategoryDTO` | ❌ **MISSING** |
| `CreateExpertiseCategoryDTO` | ❌ **MISSING** |
| `UpdateExpertiseCategoryDTO` | ❌ **MISSING** |

### 3️⃣ Backend Service (`backend/src/db/services/resumeService.ts`)

| Function | Maps `isActive`? |
|----------|:---------------:|
| `mapExperience()` | ✅ `isActive: exp.IsActive` |
| `createExperience()` | ✅ `IsActive: data.isActive ?? true` |
| `updateExperience()` | ✅ `IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive` |
| `mapExpertiseCategory()` | ❌ **No isActive mapping at all** |
| `createExpertiseCategory()` | ❌ **Does not set IsActive** |
| `updateExpertiseCategory()` | ❌ **Does not handle IsActive** |

### 4️⃣ Backend Zod Schemas (`backend/src/api/schemas/index.ts`)

| Schema | Has `isActive`? |
|--------|:--------------:|
| `experienceResponseSchema` | ✅ `isActive: z.boolean()` |
| `createExperienceRequestSchema` | ✅ `isActive: z.boolean().optional()` |
| `updateExperienceRequestSchema` | ✅ `isActive: z.boolean().optional()` |
| `expertiseCategoryResponseSchema` | ❌ **MISSING** |
| `createExpertiseCategoryRequestSchema` | ❌ **MISSING** |
| `updateExpertiseCategoryRequestSchema` | ❌ **MISSING** |

### 5️⃣ Frontend Types (`adminPage/types/index.ts`)

| Type | Has `isActive`? |
|------|:--------------:|
| `Experience` | ✅ `isActive: boolean` |
| `ExpertiseCategory` | ✅ `isActive: boolean` — but backend never sends it! |

## Key Finding

The frontend `ExpertiseCategory` type **declares** `isActive: boolean`, but:

1. Backend DTO `ExpertiseCategoryDTO` doesn't have `isActive`
2. Backend `mapExpertiseCategory()` never maps `cat.IsActive` → `isActive`
3. Backend create/update services never handle `IsActive`
4. Backend Zod schemas (response & request) don't include `isActive`

**Result**: The API response for expertise categories has NO `isActive` property → `hasIsActiveField = false` → toggle column is hidden.

## Same Pattern Exists For

Based on the backend DTOs and schemas, these models also have `IsActive` in the Prisma schema but it's **not mapped to the API response**:

| Model | Prisma Has IsActive? | API Response Has isActive? | Toggle Shows? |
|-------|:-------------------:|:-------------------------:|:-------------:|
| Section | ✅ | ❌ (not in sectionResponseSchema) | ❌ |
| Contact | ✅ | ❌ (not in contactResponseSchema) | ❌ |
| Blog | ✅ | ❌ (not in blogResponseSchema) | ❌ |
| Trip | ✅ | ❌ (not in tripResponseSchema) | ❌ |
| Recipe | ✅ | ❌ (not in recipeResponseSchema) | ❌ |
| Experience | ✅ | ✅ | ✅ |
| ExpertiseCategory | ✅ | ❌ | ❌ |

Only **Experience** has the `isActive` field plumbed all the way through from Prisma → DTO → Service → Schema → Frontend.

## Fix Required

For each resource you want the toggle to show, you need to:

1. **DTO**: Add `isActive: boolean` to the DTO interface
2. **Service**: Add `isActive: cat.IsActive` to the mapping function, and add `IsActive` handling in create/update
3. **Schema**: Add `isActive: z.boolean()` to response schema and `isActive: z.boolean().optional()` to create/update request schemas