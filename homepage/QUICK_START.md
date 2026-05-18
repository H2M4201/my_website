# Quick Start Guide

Get the dynamic database integration running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- SQL Server 2019+ (local or remote)
- Git & npm available

## Step 1: Install Dependencies (2 min)

```bash
cd homepage
npm install
```

## Step 2: Configure Database (2 min)

### Option A: Local SQL Server

Update `.env.local` with your SQL Server details:

```bash
DATABASE_URL="Server=localhost;Database=portfolio_db;User Id=sa;Password=YourPassword123!;Encrypt=true;TrustServerCertificate=true;"
```

### Option B: Create SQL Server Tables

Run this SQL in your SQL Server instance:

```sql
USE your_database_name;

CREATE TABLE dbo.Section (
    id INT IDENTITY(1,1) PRIMARY KEY,
    SectionName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    Href NVARCHAR(255) NULL
);

CREATE TABLE dbo.Contact (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ContactType NVARCHAR(50) NOT NULL,
    ContactInfo NVARCHAR(255) NOT NULL,
    Icon NVARCHAR(100) NULL
);
```

## Step 3: Generate Prisma Client (1 min)

```bash
npm run prisma:generate
```

## Step 4: Seed Sample Data (1 min)

```bash
npm run prisma:seed
```

Expected output:
```
Starting database seed...
✓ Created 4 sections
✓ Created 4 contacts
✓ Database seed completed successfully!
```

## Step 5: Run Tests (1 min)

```bash
npm run test
```

All tests should pass:
```
PASS  __tests__/lib/db/sectionsService.test.ts
PASS  __tests__/lib/db/contactsService.test.ts
PASS  __tests__/api/sections.test.ts
PASS  __tests__/api/contacts.test.ts
```

## Step 6: Start Dev Server (1 min)

```bash
npm run dev:ssl
```

Server will start:
```
✓ Certificate generated successfully at ./certs
> Ready on https://localhost:3000
```

## Step 7: Test the App

### In Browser

Open [https://localhost:3000](https://localhost:3000) (ignore self-signed cert warning)

You should see:
- ✅ 4 section cards (Resume, Trips, Blogs, Recipe) with database content
- ✅ 4 contact cards (Phone, Email, GitHub, LinkedIn) with database content
- ✅ Skeleton loaders while fetching
- ✅ No hardcoded data

### In Terminal

Test API endpoints:

```bash
# Get all sections
curl --insecure https://localhost:3000/api/sections | jq

# Get single section (ID 1)
curl --insecure https://localhost:3000/api/sections/1 | jq

# Get all contacts
curl --insecure https://localhost:3000/api/contacts | jq

# Test 404 error
curl --insecure https://localhost:3000/api/sections/999 | jq
```

## What Was Implemented

✅ **Database Layer**
- Prisma ORM with SQL Server
- Type-safe queries
- Connection pooling

✅ **API Endpoints**
- `GET /api/sections` - All sections
- `GET /api/sections/{id}` - Single section
- `GET /api/contacts` - All contacts

✅ **HTTPS Enforcement**
- Auto-generated self-signed certs (dev)
- HTTP → HTTPS redirect (prod)
- Security headers included

✅ **Frontend Integration**
- Server components for data fetching
- Suspense boundaries with loading states
- Error boundaries with fallback UI
- Reused existing components

✅ **Testing**
- Unit tests for services
- API route handler tests
- Mock database connections
- Jest + React Testing Library

✅ **Documentation**
- Database setup guide
- API documentation
- Implementation details
- This quick start guide

## Troubleshooting

### Database Connection Error

```
Error: Connection failed
```

**Solution:**
1. Verify SQL Server is running
2. Check connection string in `.env.local`
3. Verify database and tables exist
4. Run seed script: `npm run prisma:seed`

### Certificate Error

```
Error: ENOENT: no such file or directory, open './certs/cert.pem'
```

**Solution:**
- Certs auto-generate on first run
- If missing, run: `npm run dev:ssl` again
- Or manually generate: `openssl req -nodes -new -x509 -days 365 -keyout ./certs/key.pem -out ./certs/cert.pem -subj "/C=US/ST=State/L=City/O=Org/CN=localhost"`

### Tests Failing

```
FAIL  __tests__/api/sections.test.ts
```

**Solution:**
1. Clear Jest cache: `npm test -- --clearCache`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Regenerate Prisma: `npm run prisma:generate`

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution:**
- Kill existing process on port 3000
- Or use different port: `PORT=3001 npm run dev:ssl`

## Next Steps

### 1. Update API Credentials
- Update contact info in database
- Modify phone, email, GitHub, LinkedIn

### 2. Add More Sections
- Insert new rows in `Section` table
- App will fetch automatically

### 3. Customize Styling
- Update Tailwind classes in components
- Modify color scheme in `layout.tsx`

### 4. Deploy to Production
- See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for production setup
- Configure real SSL certificates
- Update DATABASE_URL for prod database

### 5. Add More Features
- Admin dashboard for content management
- Rate limiting with Redis
- Webhook notifications
- Analytics tracking

## File Reference

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (database URL, etc.) |
| `app/page.tsx` | Updated home page (server component) |
| `app/api/sections/route.ts` | GET /api/sections endpoint |
| `app/api/sections/[id]/route.ts` | GET /api/sections/{id} endpoint |
| `app/api/contacts/route.ts` | GET /api/contacts endpoint |
| `lib/db/prisma.ts` | Prisma client singleton |
| `lib/db/sectionsService.ts` | Section queries |
| `lib/db/contactsService.ts` | Contact queries |
| `prisma/schema.prisma` | Database schema |
| `scripts/seed.ts` | Database seeder |
| `server.js` | HTTPS dev server |
| `DATABASE.md` | Database setup details |
| `API.md` | API documentation |

## Support

For detailed information:
- **Database**: See [DATABASE.md](DATABASE.md)
- **API**: See [API.md](API.md)
- **Implementation**: See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

Happy coding! 🚀
