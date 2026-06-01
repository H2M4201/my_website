# API Logging & Debugging Guide

## Overview

All API requests are now logged to make debugging easier:
- **Browser Console**: Shows all client-side API calls (F12 → Console tab)
- **Network Tab**: Shows HTTP requests with headers, body, and response (F12 → Network tab)
- **Backend Terminal**: Shows all incoming requests with method, path, status, and duration

## Frontend Logging

### Homepage API Calls

When the homepage loads or makes API requests, you'll see logs like:

```
[Homepage] 🚀 GET https://localhost:4000/api/sections
[Homepage] ✅ GET https://localhost:4000/api/sections → 200 (5 items)
[Homepage] 🚀 GET https://localhost:4000/api/contacts
[Homepage] ✅ GET https://localhost:4000/api/contacts → 200 (3 items)
```

**Where to see these logs:**
- Open browser DevTools: Press `F12`
- Go to **Console** tab
- Logs will appear in real-time

### Admin Dashboard API Calls

When using the admin dashboard, you'll see logs like:

```
[AdminPage] 🚀 GET http://localhost:4000/api/blogs
[AdminPage] ✅ GET http://localhost:4000/api/blogs → 200
[AdminPage] 🚀 POST http://localhost:4000/api/users
[AdminPage] ✅ POST http://localhost:4000/api/users → 201
[AdminPage] 🚀 PATCH http://localhost:4000/api/sections/1
[AdminPage] ✅ PATCH http://localhost:4000/api/sections/1 → 200
[AdminPage] 🚀 DELETE http://localhost:4000/api/recipes/5
[AdminPage] ✅ DELETE http://localhost:4000/api/recipes/5 → 204
```

**Where to see these logs:**
- Open browser DevTools: Press `F12`
- Go to **Console** tab
- Logs will appear as you interact with the admin dashboard

## Backend Logging

When the backend server is running, you'll see logs in the terminal like:

```
[2026-05-18T14:32:15.000Z] 🚀 INCOMING GET /api/sections from ::1
   ✅ Response 200 in 45ms

[2026-05-18T14:32:16.000Z] 🚀 INCOMING POST /api/blogs from ::1
   📦 Body: {
  "title": "My Blog Post",
  "content": "Hello world"
}
   ✅ Response 201 in 120ms

[2026-05-18T14:32:17.000Z] 🚀 INCOMING GET /api/contacts from ::1
   ✅ Response 200 in 28ms
```

**Log Format:**
- 🚀 = Request incoming (method, path, IP address)
- 📦 = Request body (for POST/PATCH/PUT only)
- ✅ = Success response (HTTP 200-299)
- ⚠️ = Redirect response (HTTP 300-399)
- ❌ = Error response (HTTP 400-599)
- Duration = Time taken to process the request

**Backend Terminal:**
The terminal running `npm run dev` or `npm run dev:ssl` in the backend folder will show these logs in real-time.

## How to View API Calls

### Method 1: Browser Console (F12)

**Steps:**
1. Open your app in the browser (http://localhost:5000 or https://localhost:5000)
2. Press `F12` or right-click → "Inspect"
3. Go to **Console** tab
4. Look for logs starting with `[Homepage]` or `[AdminPage]`

**Example:**
```
[AdminPage] 🚀 GET http://localhost:4000/api/sections
[AdminPage] ✅ GET http://localhost:4000/api/sections → 200
```

### Method 2: Browser Network Tab (F12)

**Steps:**
1. Press `F12` or right-click → "Inspect"
2. Go to **Network** tab
3. Reload the page or perform an action
4. Look for requests to `localhost:4000`

**Columns to check:**
- **Name**: The API endpoint (e.g., `/api/sections`)
- **Method**: HTTP method (GET, POST, PATCH, DELETE)
- **Status**: HTTP status code (200, 201, 400, etc.)
- **Type**: Response type (json, blob, etc.)
- **Time**: How long the request took

**Click on a request to see:**
- **Headers**: Request/response headers
- **Preview**: Formatted JSON response
- **Response**: Raw response body

### Method 3: Backend Terminal Logs

**Steps:**
1. Look at the terminal where you ran `npm run dev:ssl` in the backend folder
2. Each incoming request will log in real-time

**Example:**
```
[2026-05-18T14:32:15.000Z] 🚀 INCOMING GET /api/sections from ::1
   ✅ Response 200 in 45ms
```

## Configuration

### Frontend URLs

**Homepage** (`.env.local`):
```env
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Admin Dashboard** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend CORS Configuration

The backend in `backend/src/app.ts` is configured to accept requests from:
- `http://localhost:3000` (homepage HTTP)
- `https://localhost:3000` (homepage HTTPS)
- `http://localhost:5000` (admin dashboard HTTP)
- `https://localhost:5000` (admin dashboard HTTPS)

If you're accessing from a different origin, you'll see CORS errors in the browser console.

## Troubleshooting

### No API Calls Showing in Console

**Possible causes:**
1. Backend is not running
2. Wrong API URL in environment variables
3. CORS error (check if it's logged in console)

**Solutions:**
- Verify backend is running: Check terminal running `npm run dev:ssl`
- Check the URL: Open DevTools Console and look for any error messages
- Check CORS origins in `backend/src/app.ts`

### CORS Error in Browser

**Error message:**
```
Access to XMLHttpRequest at 'http://localhost:4000/api/sections' from origin 'http://localhost:5000' 
has been blocked by CORS policy
```

**Solutions:**
1. Ensure backend CORS includes your frontend URL
2. Update `backend/src/app.ts` if using a different origin
3. Restart the backend server after changes

### Requests Showing 404 or 500 Errors

1. Check the backend terminal for error logs
2. Verify the API endpoint exists in `backend/src/api/routes/`
3. Check request payload format in browser Network tab

### Connection Refused Error

**Error message:**
```
Failed to connect to http://localhost:4000
```

**Solution:**
1. Start the backend server: `cd backend && npm run dev:ssl`
2. Verify it's running on port 4000 (check terminal output)

## Quick Start

1. **Start Backend:**
```bash
cd backend
npm run dev:ssl
```
Look for: `Backend API ready on https://localhost:4000`

2. **Start Admin Dashboard:**
```bash
cd adminPage
npm run dev:ssl
```
Look for: `ready on https://localhost:5000`

3. **Open Admin Dashboard:**
- Go to https://localhost:5000
- Press F12 for DevTools
- Go to Console tab
- You should see API call logs appearing in real-time

4. **Monitor Backend:**
- Keep the backend terminal visible
- You'll see matching logs for each request
- Times should match (within a few milliseconds)

## Log Symbols Reference

| Symbol | Meaning | Examples |
|--------|---------|----------|
| 🚀 | Request initiated | `🚀 INCOMING GET /api/sections` |
| 📦 | Request body | `📦 Body: { "name": "John" }` |
| ✅ | Success (2xx) | `✅ Response 200 in 45ms` |
| ⚠️ | Redirect (3xx) | `⚠️ Response 301 in 12ms` |
| ❌ | Client/Server Error (4xx/5xx) | `❌ Response 404 in 28ms` |

---

## Next Steps

1. ✅ Both frontend and backend are configured to use logging
2. ✅ API calls should now be visible in browser console and network tab
3. ✅ Backend logs all incoming requests in terminal
4. 🔄 Monitor logs while testing the apps
5. 🐛 Use logs to debug any issues with API communication
