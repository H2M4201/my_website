#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env')
const examplePath = path.join(__dirname, '..', '.env.example')

const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
if (isProd) {
  console.log('Production environment detected; skipping ensure-sqlserver.')
  process.exit(0)
}

if (!fs.existsSync(examplePath)) {
  console.error('Missing .env.example; cannot extract SQL Server DATABASE_URL')
  process.exit(1)
}

const example = fs.readFileSync(examplePath, 'utf8')
const match = example.match(/^\s*DATABASE_URL\s*=\s*.+$/m)
if (!match) {
  console.error('No DATABASE_URL found in .env.example')
  process.exit(1)
}

const sqlLine = match[0].trim()

let envContent = ''
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
  const backupPath = envPath + `.bak.${Date.now()}`
  try {
    fs.copyFileSync(envPath, backupPath)
    console.log(`Backed up existing .env → ${backupPath}`)
  } catch (err) {
    console.warn('Could not create .env backup:', err.message)
  }
}

if (/^\s*#?\s*DATABASE_URL\s*=.*$/m.test(envContent)) {
  envContent = envContent.replace(/^\s*#?\s*DATABASE_URL\s*=.*$/m, sqlLine)
} else {
  envContent = sqlLine + '\n' + envContent
}

fs.writeFileSync(envPath, envContent, 'utf8')
console.log('✅ Ensured DATABASE_URL is SQL Server in backend/.env (non-production)')
