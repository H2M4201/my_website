/**
 * Script to switch between Prisma schema files for different database providers.
 *
 * The default schema.prisma uses PostgreSQL (for Docker/Supabase).
 * For local development with SQL Server, use: npm run prisma:generate:local
 *
 * Usage:
 *   node scripts/switch-prisma.js sqlserver   → copies schema.sqlserver.prisma → schema.prisma
 *   node scripts/switch-prisma.js postgresql  → restores default PostgreSQL schema
 */

const fs = require('fs')
const path = require('path')

const PRISMA_DIR = path.join(__dirname, '..', 'prisma')
const TARGET = process.argv[2]?.toLowerCase()

if (!TARGET || !['sqlserver', 'postgresql'].includes(TARGET)) {
  console.error('Usage: node scripts/switch-prisma.js [sqlserver|postgresql]')
  process.exit(1)
}

const defaultSchema = path.join(PRISMA_DIR, 'schema.prisma')
const sqlserverSchema = path.join(PRISMA_DIR, 'schema.sqlserver.prisma')
const backupSchema = path.join(PRISMA_DIR, 'schema.postgresql.backup.prisma')

if (TARGET === 'sqlserver') {
  // Backup the current PostgreSQL schema before overwriting
  if (fs.existsSync(defaultSchema)) {
    fs.copyFileSync(defaultSchema, backupSchema)
    console.log('✓ Backed up current schema.prisma → schema.postgresql.backup.prisma')
  }

  // Copy SQL Server schema over
  if (!fs.existsSync(sqlserverSchema)) {
    console.error(`SQL Server schema not found: ${sqlserverSchema}`)
    process.exit(1)
  }
  fs.copyFileSync(sqlserverSchema, defaultSchema)
  console.log('✓ Switched schema.prisma to SQL Server provider')
} else if (TARGET === 'postgresql') {
  // Restore PostgreSQL schema from backup
  if (fs.existsSync(backupSchema)) {
    fs.copyFileSync(backupSchema, defaultSchema)
    fs.unlinkSync(backupSchema)
    console.log('✓ Restored schema.prisma to PostgreSQL provider')
  } else {
    console.log('✓ schema.prisma already uses PostgreSQL provider (default)')
  }
}