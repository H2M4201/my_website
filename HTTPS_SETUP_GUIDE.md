# Setup Guide: HTTPS Configuration for Backend and Admin Dashboard

## Overview
This guide explains the HTTPS setup for both the backend API (port 4000) and the admin dashboard (port 5000).

## Changes Made

### 1. PostCSS Configuration Fix (adminPage)
**Issue**: PostCSS was using the old require() function syntax which is incompatible with newer Next.js versions.

**Fix**: Updated `postcss.config.js` to use object notation:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. HTTPS Server Setup

#### Admin Dashboard (Port 5000)
- Created `adminPage/server.js` - HTTPS server with automatic self-signed certificate generation
- Updated `adminPage/package.json` scripts:
  - `npm run dev:ssl` - Run admin dashboard on https://localhost:5000
  - `npm run dev` - Run on http://localhost:5000 (plain HTTP)
  - `npm run start` - Production start on port 5000

#### Backend API (Port 4000)
- Created `backend/src/server.ts` - HTTPS server with certificate support
- Updated `backend/package.json` scripts:
  - `npm run dev:ssl` - Run backend on https://localhost:4000 with HTTPS
  - `npm run dev` - Run on http://localhost:4000 (plain HTTP)
  - `npm run start:ssl` - Production start with HTTPS on port 4000

### 3. CORS Configuration
Updated `backend/src/app.ts` to include CORS origins for:
- http://localhost:5000 (admin dashboard HTTP)
- https://localhost:5000 (admin dashboard HTTPS)
- http://127.0.0.1:5000
- https://127.0.0.1:5000

## Running the Services

### Option 1: HTTP (Simple Development)
```bash
# Terminal 1 - Backend on port 4000
cd backend
npm run dev

# Terminal 2 - Admin Dashboard on port 5000
cd adminPage
npm run dev
```
- Backend: http://localhost:4000
- Admin Dashboard: http://localhost:5000

### Option 2: HTTPS (Recommended for Production-like Testing)
```bash
# Terminal 1 - Backend on port 4000 with HTTPS
cd backend
npm run dev:ssl

# Terminal 2 - Admin Dashboard on port 5000 with HTTPS
cd adminPage
npm run dev:ssl
```
- Backend: https://localhost:4000
- Admin Dashboard: https://localhost:5000

## Certificate Management

### Self-Signed Certificates
Certificates are automatically generated on first run in the `.cert` directory:
- **Admin Dashboard**: `adminPage/.cert/`
- **Backend**: `backend/.cert/`

### First Run
When you first run `npm run dev:ssl`, the system will:
1. Check if certificates exist
2. If not, automatically generate self-signed certificates using OpenSSL
3. Store them in the `.cert` folder

**Requirement**: OpenSSL must be installed and available in your PATH.
- **Windows**: Usually included with Git Bash or available via Chocolatey (`choco install openssl`)
- **macOS**: Usually pre-installed or install via Homebrew (`brew install openssl`)
- **Linux**: Install via package manager (`sudo apt install openssl`)

### Browser Warnings
When accessing HTTPS URLs, your browser will show a security warning because the certificates are self-signed. This is normal for development. You can safely click "Proceed" or "Advanced" → "Proceed anyway".

## Environment Variables

Add these to your `.env` files if needed:

**Backend** (`backend/.env`):
```env
PORT=4000
CORS_ORIGIN=https://localhost:5000,http://localhost:5000
```

**Admin Dashboard** (`adminPage/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://localhost:4000
```

## Port Configuration

| Service | HTTP Port | HTTPS Port | Config File |
|---------|-----------|-----------|-------------|
| Homepage | 3000 | 3000 | homepage/server.js |
| Admin Dashboard | 5000 | 5000 | adminPage/server.js |
| Backend API | 4000 | 4000 | backend/src/server.ts |

## Troubleshooting

### "OpenSSL is not found"
**Solution**: Install OpenSSL on your system:
- **Windows**: Run `choco install openssl` in PowerShell (admin) or install Git Bash
- **macOS**: Run `brew install openssl`
- **Linux**: Run `sudo apt install openssl`

### "Certificate already exists"
If you want to regenerate certificates, delete the `.cert` folder and restart the server:
```bash
rm -rf adminPage/.cert   # For admin dashboard
rm -rf backend/.cert     # For backend
npm run dev:ssl          # Restart to regenerate
```

### "Port already in use"
If a port is already in use, specify a different port:
```bash
PORT=5001 npm run dev:ssl  # Admin on 5001 instead of 5000
```

### CORS Errors
If you see CORS errors, ensure:
1. The backend is running with HTTPS when the admin dashboard is on HTTPS
2. CORS origins in `backend/src/app.ts` include the admin dashboard URL
3. The correct protocol (http/https) is used in API requests

## Project Structure

```
my_website/
├── backend/
│   ├── src/
│   │   ├── app.ts           (Updated CORS config)
│   │   ├── server.ts        (New: HTTPS server)
│   │   └── index.ts
│   ├── package.json         (Updated scripts)
│   └── .cert/               (Auto-generated certificates)
├── adminPage/
│   ├── server.js            (New: HTTPS server)
│   ├── postcss.config.js    (Fixed)
│   ├── package.json         (Updated scripts)
│   └── .cert/               (Auto-generated certificates)
└── homepage/
    ├── server.js            (Existing HTTPS server)
    └── package.json
```

## Next Steps

1. Ensure OpenSSL is installed on your system
2. Run the services using the HTTPS commands
3. Accept the browser's self-signed certificate warning
4. Update your admin dashboard to make API calls to `https://localhost:4000`
5. The backend will automatically include the admin dashboard in CORS headers
