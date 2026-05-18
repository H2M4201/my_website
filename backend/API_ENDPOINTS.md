# API Endpoints Documentation

## Overview

This document describes all CRUD endpoints for the backend API. The API is organized with a clean, RESTful structure following best practices.

## Directory Structure

```
backend/src/
├── api/
│   ├── routes/
│   │   ├── sections.routes.ts
│   │   ├── contacts.routes.ts
│   │   ├── blogs.routes.ts
│   │   ├── trips.routes.ts
│   │   └── recipes.routes.ts
│   ├── schemas/
│   │   └── index.ts (all validation schemas)
│   ├── schemas.ts (re-export for backward compatibility)
│   └── index.ts (registers all routes)
├── db/
│   ├── services/
│   │   ├── sectionsService.ts
│   │   ├── contactsService.ts
│   │   ├── blogsService.ts
│   │   ├── tripsService.ts
│   │   └── recipesService.ts
│   ├── dtos/
│   │   ├── sectionDTO.ts
│   │   ├── contactDTO.ts
│   │   ├── blogDTO.ts
│   │   ├── tripDTO.ts
│   │   ├── recipeDTO.ts
│   │   └── index.ts
│   ├── prisma.ts
│   ├── sectionsService.ts (re-export from services)
│   ├── contactsService.ts (re-export from services)
│   └── index.ts (main db module export)
├── app.ts
└── index.ts
```

## Code Organization Principles

1. **DTOs Folder** (`db/dtos/`): All Data Transfer Objects for type safety
2. **Services Folder** (`db/services/`): All database operations and business logic
3. **Routes Folder** (`api/routes/`): All HTTP endpoint handlers
4. **Schemas Folder** (`api/schemas/`): All Zod validation schemas

## API Endpoints

### Sections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sections` | Get all sections |
| GET | `/api/sections/:id` | Get section by ID |
| POST | `/api/sections` | Create new section |
| PATCH | `/api/sections/:id` | Update section by ID |
| DELETE | `/api/sections/:id` | Delete section by ID |
| DELETE | `/api/sections` | Delete all sections |

**Section DTO:**
```typescript
{
  id: number
  title: string
  description: string | null
  href: string | null
}
```

**Create/Update Request:**
```typescript
{
  title: string (required for create)
  description?: string | null
  href?: string | null
}
```

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| GET | `/api/contacts/:id` | Get contact by ID |
| POST | `/api/contacts` | Create new contact |
| PATCH | `/api/contacts/:id` | Update contact by ID |
| DELETE | `/api/contacts/:id` | Delete contact by ID |
| DELETE | `/api/contacts` | Delete all contacts |

**Contact DTO:**
```typescript
{
  id: number
  type: string
  info: string
  icon: string | null
}
```

**Create/Update Request:**
```typescript
{
  type: string (required for create)
  info: string (required for create)
  icon?: string | null
}
```

### Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/:id` | Get blog by ID |
| POST | `/api/blogs` | Create new blog |
| PATCH | `/api/blogs/:id` | Update blog by ID |
| DELETE | `/api/blogs/:id` | Delete blog by ID |
| DELETE | `/api/blogs` | Delete all blogs |

**Blog DTO:**
```typescript
{
  id: number
  title: string
  description: string | null
  content: string | null
}
```

**Create/Update Request:**
```typescript
{
  title: string (required for create)
  description?: string | null
  content?: string | null
}
```

### Trips

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Get all trips |
| GET | `/api/trips/:id` | Get trip by ID |
| POST | `/api/trips` | Create new trip |
| PATCH | `/api/trips/:id` | Update trip by ID |
| DELETE | `/api/trips/:id` | Delete trip by ID |
| DELETE | `/api/trips` | Delete all trips |

**Trip DTO:**
```typescript
{
  id: number
  title: string
  time: string | null
  location: string | null
  content: string | null
}
```

**Create/Update Request:**
```typescript
{
  title: string (required for create)
  time?: string | null
  location?: string | null
  content?: string | null
}
```

### Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create new recipe |
| PATCH | `/api/recipes/:id` | Update recipe by ID |
| DELETE | `/api/recipes/:id` | Delete recipe by ID |
| DELETE | `/api/recipes` | Delete all recipes |

**Recipe DTO:**
```typescript
{
  id: number
  name: string
  description: string | null
}
```

**Create/Update Request:**
```typescript
{
  name: string (required for create)
  description?: string | null
}
```

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

## Error Response Format

```typescript
{
  error: string
  details?: Array<{ message: string; path: string[] }> // For validation errors
}
```

## Caching

- GET all: `Cache-Control: public, max-age=300` (5 minutes)
- GET by ID: `Cache-Control: public, max-age=300` (5 minutes)

## Validation

All endpoints use Zod schemas for request/response validation:
- Create requests validate required fields
- Update requests make all fields optional
- Response DTOs ensure consistent structure

## Usage Examples

### Create a Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "description": "A great blog post",
    "content": "Full content here..."
  }'
```

### Update a Blog
```bash
curl -X PATCH http://localhost:5000/api/blogs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Get All Blogs
```bash
curl http://localhost:5000/api/blogs
```

### Delete a Blog
```bash
curl -X DELETE http://localhost:5000/api/blogs/1
```

## Key Features

✅ Complete CRUD operations for all 6 entities
✅ Consistent error handling
✅ Zod validation for request/response
✅ Clean separation of concerns (DTOs, Services, Routes)
✅ Organized folder structure by feature
✅ Backward compatibility maintained
✅ Type-safe operations
✅ Proper HTTP status codes
✅ Caching headers on GET requests
