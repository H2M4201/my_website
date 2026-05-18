# Database Setup & Configuration

## SQL Server Configuration

### Prerequisites
- SQL Server 2019 or later (local or remote instance)
- SQL Server Management Studio (SSMS) or Azure Data Studio
- Node.js 18+ installed

### 1. Create Database Tables

Run the following SQL script against your SQL Server instance:

```sql
USE your_database_name;

-- Create Section table
CREATE TABLE dbo.Section (
    id INT IDENTITY(1,1) PRIMARY KEY,
    SectionName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    Href NVARCHAR(255) NULL,
    CONSTRAINT UQ_SectionName UNIQUE (SectionName)
);

-- Create Contact table
CREATE TABLE dbo.Contact (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ContactType NVARCHAR(50) NOT NULL,
    ContactInfo NVARCHAR(255) NOT NULL,
    Icon NVARCHAR(100) NULL
);

-- Create indexes for performance
CREATE INDEX IX_Section_SectionName ON dbo.Section(SectionName);
CREATE INDEX IX_Contact_ContactType ON dbo.Contact(ContactType);
```

### 2. Update `.env.local`

Update the `DATABASE_URL` in [.env.local](.env.local):

```bash
DATABASE_URL="Server=YOUR_SERVER;Database=YOUR_DATABASE;User Id=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=true;TrustServerCertificate=false;"
```

**Connection String Components:**
- `Server`: Your SQL Server hostname/IP (e.g., `localhost`, `server.example.com`)
- `Database`: Database name (e.g., `portfolio_db`)
- `User Id`: SQL Server login user
- `Password`: SQL Server password
- `Encrypt`: Always `true` for production
- `TrustServerCertificate`: `false` for production, `true` for local dev with self-signed certs

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client from the [prisma/schema.prisma](prisma/schema.prisma) file.

### 4. Seed Database

Insert sample data into the database:

```bash
npm run prisma:seed
```

This runs [scripts/seed.ts](scripts/seed.ts) and populates both `Section` and `Contact` tables with sample data.

## Verification

### Verify Database Connection

Run a quick test to confirm the connection works:

```bash
npm run test -- __tests__/lib/db/sectionsService.test.ts
```

All tests should pass if the database connection is configured correctly.

### Verify Data

Query the database directly:

```sql
SELECT * FROM dbo.Section;
SELECT * FROM dbo.Contact;
```

## Troubleshooting

### Connection String Issues

**Error:** `Login failed for user`
- Verify username and password are correct
- Check SQL Server authentication mode (should allow mixed mode)

**Error:** `Cannot open database`
- Verify database name is correct and exists
- Check SQL Server instance is running: `sqlcmd -S SERVER_NAME`

**Error:** `Timeout expired`
- SQL Server may not be accessible (firewall, port 1433)
- Check SQL Server browser is running
- Test connection: `sqlcmd -S SERVER_NAME -U USERNAME -P PASSWORD`

### Prisma Issues

**Error:** `prisma generate failed`
- Ensure `.env.local` has valid `DATABASE_URL`
- Check connection string syntax carefully
- Review [Prisma SQL Server docs](https://www.prisma.io/docs/orm/overview/databases/sql-server)

## Connection Pooling

Prisma automatically handles connection pooling. Default pool size is 10 connections. Adjust in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")  # For migrations
}
```

## Migrations

To apply schema changes:

```bash
# Create a migration
npm run prisma:migrate

# View migration status
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Production Considerations

1. **Connection Pooling**: Use SQL Server connection pooling via PgBouncer or similar for high-concurrency workloads
2. **Encryption**: Always use `Encrypt=true` in production
3. **Firewall**: Restrict SQL Server access to app servers only
4. **Backups**: Schedule regular SQL Server backups
5. **Monitoring**: Monitor connection pool utilization and query performance
6. **Scaling**: Use read replicas or Always On Availability Groups for high availability
