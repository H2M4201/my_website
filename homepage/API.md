# API Documentation

## Overview

The API provides endpoints to fetch portfolio sections and contact information from a SQL Server database. All endpoints are served over HTTPS and cached for 5 minutes.

## Base URL

```
https://localhost:3000/api  (development)
https://your-domain.com/api (production)
```

## Endpoints

### GET /api/sections

Retrieves all portfolio sections.

**Request:**
```bash
curl https://localhost:3000/api/sections
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Resume",
    "description": "View my professional experience, education, and technical skills accumulated over decades.",
    "href": "/resume"
  },
  {
    "id": 2,
    "title": "Trips",
    "description": "Discover the amazing places I've traveled and the experiences I've collected around the world.",
    "href": "/trips"
  }
]
```

**Cache:** 5 minutes (`Cache-Control: public, max-age=300`)

**Errors:**
- `500 Internal Server Error`: Database connection failed or validation error

---

### GET /api/sections/{id}

Retrieves a single section by ID.

**Request:**
```bash
curl https://localhost:3000/api/sections/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Resume",
  "description": "View my professional experience...",
  "href": "/resume"
}
```

**Errors:**
- `400 Bad Request`: Invalid section ID (not a positive integer)
- `404 Not Found`: Section with given ID does not exist
- `500 Internal Server Error`: Database connection failed

**Example Error Response (404):**
```json
{
  "error": "Section with id 999 not found"
}
```

---

### GET /api/contacts

Retrieves all contact information.

**Request:**
```bash
curl https://localhost:3000/api/contacts
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "type": "Phone",
    "info": "+1 234 567 890",
    "icon": "phone"
  },
  {
    "id": 2,
    "type": "Email",
    "info": "your.email@example.com",
    "icon": "mail"
  },
  {
    "id": 3,
    "type": "GitHub",
    "info": "username",
    "icon": "github"
  },
  {
    "id": 4,
    "type": "LinkedIn",
    "info": "your-profile-url",
    "icon": "linkedin"
  }
]
```

**Cache:** 5 minutes (`Cache-Control: public, max-age=300`)

**Errors:**
- `500 Internal Server Error`: Database connection failed or validation error

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation failed) |
| 404 | Not Found |
| 500 | Internal Server Error |

## HTTPS Enforcement

All API endpoints require HTTPS:
- **Development**: Self-signed certificates auto-generated in `./certs/`
- **Production**: Certificates must be installed on the server
- **HTTP Requests**: Automatically redirected to HTTPS (or rejected if `ALLOW_HTTP` env var not set)

### Testing HTTP to HTTPS Redirect (Production)

```bash
# This should redirect to HTTPS (HTTP/307)
curl -i http://localhost:3000/api/sections -L
```

### Testing HTTPS in Development

```bash
# Trust self-signed certificate in curl
curl --insecure https://localhost:3000/api/sections

# Or using Node.js
NODE_TLS_REJECT_UNAUTHORIZED=0 node script.js
```

## Security

1. **Parameterized Queries**: All queries use Prisma (auto-parameterized), preventing SQL injection
2. **Input Validation**: All request parameters are validated with Zod schemas
3. **Error Sanitization**: API errors do not leak internal database details
4. **HTTPS Enforcement**: All API endpoints are HTTPS-only in production
5. **Security Headers**:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`

## Caching

All successful responses are cached for 5 minutes. To bypass cache during development:

```bash
# Add cache-busting header
curl -H "Cache-Control: no-cache" https://localhost:3000/api/sections
```

## Rate Limiting

Currently not implemented. Add with Redis or in-memory store for production:

```typescript
// TODO: Implement rate limiting middleware
```

## Authentication

Currently not implemented. All endpoints are public. To add authentication:

1. Extend [lib/middleware.ts](lib/middleware.ts) with auth checks
2. Add API key or JWT validation
3. Document authentication headers

## Usage Examples

### JavaScript/TypeScript (Fetch API)

```typescript
// Fetch all sections
const sections = await fetch('https://localhost:3000/api/sections')
  .then(res => res.json())

// Fetch single section
const section = await fetch('https://localhost:3000/api/sections/1')
  .then(res => res.json())

// Fetch all contacts
const contacts = await fetch('https://localhost:3000/api/contacts')
  .then(res => res.json())
```

### Python (Requests)

```python
import requests

# Ignore self-signed cert in dev only
requests.packages.urllib3.disable_warnings()

# Fetch sections
response = requests.get(
    'https://localhost:3000/api/sections',
    verify=False  # dev only
)
sections = response.json()
```

### cURL

```bash
# All sections
curl --insecure https://localhost:3000/api/sections | jq

# Single section
curl --insecure https://localhost:3000/api/sections/1 | jq

# All contacts  
curl --insecure https://localhost:3000/api/contacts | jq
```

## Performance

- **Response Time**: ~50-100ms (network + DB query)
- **Caching**: Responses cached for 5 minutes
- **Database Pool Size**: 10 connections (default Prisma setting)

Monitor performance:

```bash
# Run with query logging
LOG_LEVEL=debug npm run dev:ssl
```

## Versioning

API is currently v1 (implicit). Future versions would use `/api/v2/` paths.

---

For data schema and database setup, see [DATABASE.md](DATABASE.md).
