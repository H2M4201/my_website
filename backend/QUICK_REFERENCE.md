# Quick API Reference

## Base URL
```
http://localhost:5000/api
```

## Endpoint Pattern for All Resources

Each of the 6 resources follows the same CRUD pattern:

### List All
```
GET /api/{resource}
```
Response: `200 OK` with array of objects

### Get Single
```
GET /api/{resource}/:id
```
Response: `200 OK` with single object or `404 Not Found`

### Create
```
POST /api/{resource}
Body: { required fields }
```
Response: `201 Created` with created object

### Update
```
PATCH /api/{resource}/:id
Body: { fields to update }
```
Response: `200 OK` with updated object or `404 Not Found`

### Delete Single
```
DELETE /api/{resource}/:id
```
Response: `204 No Content` or `404 Not Found`

### Delete All
```
DELETE /api/{resource}
```
Response: `204 No Content`

## Resources

| Resource | Endpoint | Base Fields |
|----------|----------|------------|
| Sections | `/api/sections` | title, description, href |
| Contacts | `/api/contacts` | type, info, icon |
| Blogs | `/api/blogs` | title, description, content |
| Trips | `/api/trips` | title, time, location, content |
| Recipes | `/api/recipes` | name, description |

## Common Response Codes

| Code | Scenario |
|------|----------|
| 200 | GET/PATCH successful |
| 201 | POST successful (created) |
| 204 | DELETE successful (no content) |
| 400 | Invalid request body/params |
| 404 | Resource not found |
| 500 | Server error |

## Quick Examples

### Create Blog
```bash
POST /api/blogs
{
  "title": "My Blog Post",
  "description": "Short description",
  "content": "Full article content here..."
}
```

### Update Blog Title
```bash
PATCH /api/blogs/1
{
  "title": "Updated Title"
}
```

### Get All Sections
```bash
GET /api/sections
```

### Delete Trip
```bash
DELETE /api/trips/5
```

### Get Contact by ID
```bash
GET /api/contacts/3
```

## Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "path": ["fieldName"],
      "message": "Field error description"
    }
  ]
}
```

## Code Organization

```
backend/src/
├── api/              ← HTTP endpoints (Controllers)
│   ├── routes/       ← Endpoint handlers (5 files)
│   ├── schemas/      ← Zod validation (1 file)
│   └── index.ts      ← Route registration
│
├── db/               ← Data layer
│   ├── services/     ← Business logic (6 files)
│   ├── dtos/         ← Type definitions (6 files)
│   └── index.ts      ← Module exports
│
├── app.ts            ← Express configuration
└── index.ts          ← Server entry point
```

## Implementation Details

### DTOs (Data Transfer Objects)
- Type-safe object definitions
- Separate Create/Update/Response types
- All nullable fields clearly marked

### Services
- Business logic layer
- Direct Prisma access
- Error handling & transformation
- Custom error classes (NotFoundError)

### Routes
- HTTP handler layer
- Request validation with Zod
- Response transformation
- Proper HTTP status codes
- Cache headers on GET (5 min)

### Schemas
- Zod validation rules
- Request body schemas
- URL parameter schemas
- Response schemas
- Type coercion & constraints

## Next Steps

1. Run migrations: `npx prisma migrate dev`
2. Test endpoints with curl or Postman
3. Check `backend/API_ENDPOINTS.md` for detailed documentation
4. Extend services as needed for business logic
