# Portfolio Homepage - Dynamic Database Integration

> A Next.js portfolio website with SQL Server backend integration, HTTPS enforcement, and comprehensive testing.

## 🚀 Quick Start

Get running in 5 minutes:

```bash
# 1. Install dependencies
npm install

# 2. Configure database in .env.local
# Update DATABASE_URL with your SQL Server credentials

# 3. Generate Prisma client
npm run prisma:generate

# 4. Seed database with sample data
npm run prisma:seed

# 5. Start dev server with HTTPS
npm run dev:ssl

# Visit https://localhost:3000
```

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

## ✨ Features

### Dynamic Data Loading
- 📊 Sections & contacts loaded from SQL Server
- 🔄 Server-side rendering for better performance
- ⚡ Cached API responses (5 min TTL)
- 📱 Responsive design with Tailwind CSS

### Security & Performance
- 🔒 HTTPS-only enforcement (production)
- 🛡️ Security headers (HSTS, X-Frame-Options, etc.)
- 🔐 Parameterized queries (SQL injection prevention)
- ✅ Input validation with Zod schemas
- 🚀 Connection pooling & optimized queries

### Developer Experience
- 📝 Full TypeScript support
- 🧪 Comprehensive test suite (Jest)
- 📚 Detailed documentation & guides
- 🐛 Error boundaries & fallback UI
- 🎨 Loading skeletons for smooth UX

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Setup & testing in 10 minutes
- **[DATABASE.md](DATABASE.md)** - SQL Server configuration & troubleshooting
- **[API.md](API.md)** - API endpoints & usage examples
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Architecture & deep dive

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Browser (Client)      │
│  - SectionCard          │
│  - ContactCard          │
│  - Loading states       │
└────────────┬────────────┘
             │ Fetch
┌────────────▼────────────┐
│   Next.js Server        │
│  - /api/sections        │
│  - /api/contacts        │
│  - HTTPS middleware     │
└────────────┬────────────┘
             │ Query
┌────────────▼────────────┐
│   Service Layer         │
│  - sectionsService      │
│  - contactsService      │
│  - Prisma ORM           │
└────────────┬────────────┘
             │ Execute
┌────────────▼────────────┐
│   SQL Server Database   │
│  - Section table        │
│  - Contact table        │
└─────────────────────────┘
```

## 🗂️ Project Structure

```
homepage/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── sections/
│   │   └── contacts/
│   └── page.tsx                # Home page (server component)
├── components/
│   ├── SectionCard.tsx         # Section display
│   ├── SectionCardSkeleton.tsx  # Loading skeleton
│   ├── ErrorBoundary.tsx       # Error UI
│   └── ...
├── lib/
│   ├── db/
│   │   ├── prisma.ts           # DB client
│   │   ├── sectionsService.ts  # Queries
│   │   └── contactsService.ts
│   ├── api.ts                  # Data fetching
│   └── middleware.ts           # HTTPS enforcement
├── prisma/
│   └── schema.prisma           # Database schema
├── scripts/
│   └── seed.ts                 # Database seeder
├── __tests__/                  # Test suite
│   ├── api/
│   ├── lib/
│   └── ...
├── .env.local                  # Configuration
├── DATABASE.md                 # DB setup
├── API.md                      # API docs
├── IMPLEMENTATION_GUIDE.md     # Architecture
└── QUICK_START.md              # Setup guide
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests include:
- ✅ Unit tests for services (Prisma queries)
- ✅ API route handler tests (request/response)
- ✅ Error handling & edge cases
- ✅ Input validation (Zod schemas)

## 📡 API Endpoints

### GET /api/sections
Returns all portfolio sections.

```bash
curl --insecure https://localhost:3000/api/sections | jq
```

Response:
```json
[
  {
    "id": 1,
    "title": "Resume",
    "description": "View my professional experience...",
    "href": "/resume"
  }
]
```

### GET /api/sections/{id}
Returns a single section by ID.

```bash
curl --insecure https://localhost:3000/api/sections/1 | jq
```

### GET /api/contacts
Returns all contact information.

```bash
curl --insecure https://localhost:3000/api/contacts | jq
```

See [API.md](API.md) for full documentation.

## 🔐 HTTPS & Security

### Development
- ✅ Self-signed certificates auto-generated in `./certs/`
- ✅ HTTPS server on localhost:3000
- ✅ Trust certificate warning (normal for dev)

### Production
- ✅ Real SSL/TLS certificates required
- ✅ HTTP → HTTPS redirect enforced
- ✅ Security headers configured
- ✅ HSTS enabled (30 days)

See [DATABASE.md](DATABASE.md) for production setup.

## 🛠️ Available Scripts

```bash
npm run dev              # Regular dev server (HTTP)
npm run dev:ssl         # Dev server with HTTPS
npm run build           # Build for production
npm run start           # Start production server
npm run test            # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migration
npm run prisma:seed     # Seed database with sample data
```

## 🚀 Deployment

1. **Prepare environment:**
   ```bash
   npm install --production
   npm run prisma:generate
   npm run build
   ```

2. **Set environment variables:**
   ```bash
   DATABASE_URL="Server=prod-server;Database=prod_db;..."
   NODE_ENV=production
   ```

3. **Start server:**
   ```bash
   npm run start
   ```

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed deployment.

## 📋 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Database:** SQL Server + Prisma ORM
- **Validation:** Zod
- **Testing:** Jest + React Testing Library
- **Icons:** Lucide React, custom SVGs

## 🎯 What's New

### Before (Static)
- Hardcoded sections & contacts in page.tsx
- No database
- Manual updates required

### After (Dynamic)
- ✅ Data loaded from SQL Server
- ✅ Automatic updates on DB changes
- ✅ API endpoints for programmatic access
- ✅ Loading states & error handling
- ✅ HTTPS-only in production
- ✅ Comprehensive test coverage
- ✅ Full documentation

## 🤝 Contributing

1. Create a feature branch
2. Update tests if needed
3. Run `npm run test` to verify
4. Submit pull request

## 📝 License

MIT

---

**Questions?** See [QUICK_START.md](QUICK_START.md) or check the documentation files.
