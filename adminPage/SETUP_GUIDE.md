# Admin Dashboard Implementation Guide

## Quick Start

### Step 1: Install Dependencies
```bash
cd adminPage
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
```

### Step 3: Ensure Backend is Running
```bash
# In backend folder
npm run dev
# Should be running on http://localhost:5000
```

### Step 4: Start Development Server
```bash
npm run dev
# Open http://localhost:3001
```

## Directory Overview

### `/app` - Next.js App Directory
- **`layout.tsx`** - Root layout with metadata
- **`globals.css`** - Global styles and Tailwind imports
- **`login/page.tsx`** - Login page with authentication form
- **`dashboard/`** - Protected dashboard routes
  - `layout.tsx` - Dashboard layout with sidebar and protected route wrapper
  - `page.tsx` - Dashboard home/overview page
  - `sections/`, `contacts/`, `blogs/`, etc. - Management pages for each resource

### `/components` - Reusable Components
- **`Sidebar.tsx`** - Collapsible navigation sidebar with logout
- **`Table.tsx`** - Generic data table with edit/delete actions
- **`Modal.tsx`** - Modal dialog for forms
- **`Form.tsx`** - Form input components (Input, Textarea, Select, FormField)
- **`ProtectedRoute.tsx`** - Auth guard wrapper component
- **`CrudTemplate.tsx`** - Reusable CRUD template for all management pages

### `/hooks` - Custom Hooks
- **`useAuth.ts`** - Access and manage authentication state
- **`useApi.ts`** - Data fetching with SWR and API calls

### `/store` - State Management
- **`authStore.ts`** - Zustand store for auth state

### `/types` - TypeScript Definitions
- **`index.ts`** - All type definitions for resources

## Key Implementation Details

### Authentication Flow
1. Login page at `/login` accepts email and password
2. `useAuthStore.login()` calls backend auth endpoint
3. Token and user stored in localStorage
4. Dashboard pages wrapped with `ProtectedRoute` component
5. Protected routes check `isAuthenticated` and redirect if needed
6. Logout clears localStorage and redirects to login

### CRUD Operations
1. **List**: `useFetchAll(resource)` fetches from `/api/{resource}s`
2. **Create**: `createItem(resource, data)` POSTs to `/api/{resource}s`
3. **Read**: `useFetchOne(resource, id)` fetches `/api/{resource}s/:id`
4. **Update**: `updateItem(resource, id, data)` PATCH to `/api/{resource}s/:id`
5. **Delete**: `deleteItem(resource, id)` DELETE to `/api/{resource}s/:id`

### Component Pattern
Each management page uses `CrudTemplate` component:
- Accepts resource type, columns, and form renderer
- Handles all CRUD logic internally
- Opens modal for create/edit
- Shows confirmation for delete
- Auto-refreshes list after operations

## Modification Points

### Adding a New Resource
1. Add type definition to `/types/index.ts`
2. Create new management page in `/app/dashboard/{resource}/page.tsx`
3. Use `CrudTemplate` with resource-specific columns and form
4. Add navigation link in `Sidebar.tsx` NAV_ITEMS array

### Customizing Components
- **Sidebar**: Modify `NAV_ITEMS` for different links
- **Table**: Add custom render functions in columns
- **Forms**: Use `FormField`, `Input`, `Textarea`, `Select` components
- **Modal**: Adjust width, title, button labels via props

### Styling
- All components use Tailwind CSS classes
- Global styles in `globals.css`
- Custom Tailwind config in `tailwind.config.js`
- Extend theme colors and utilities as needed

## Testing the Admin Dashboard

### With Backend API
1. Backend must be running on localhost:5000
2. Login page simulates auth (any email/password works if backend supports)
3. Dashboard fetches real data from backend
4. CRUD operations update backend database

### Demo Mode
- Mock data fetching by modifying `useApi.ts` fetcher
- Use localStorage-based auth for testing
- Static navigation and components work offline

## Common Tasks

### Adjust Sidebar Width
Edit `Sidebar.tsx`:
- Change `w-64` to `w-80` for wider
- Change `ml-64` to `ml-80` in main content
- Adjust `w-20` to `w-24` for collapsed width

### Modify Table Columns
In each management page, adjust `columns` prop:
```tsx
columns={[
  { key: 'fieldName', label: 'Display Label' },
  // Add more columns
]}
```

### Update API URL
Modify `BASE_URL` in `/hooks/useApi.ts`:
```ts
const BASE_URL = 'http://your-api-url/api'
```

### Add Form Validation
Enhance form fields in management pages:
```tsx
<FormField label="Email" name="email" error={errors.email}>
  <Input type="email" required />
</FormField>
```

## Features Implemented

✅ Multi-page authentication with session persistence
✅ 9 resource management pages with full CRUD
✅ Collapsible navigation sidebar
✅ Modal forms for create/edit
✅ Confirmation dialogs for delete
✅ Data tables with edit/delete actions
✅ Loading and error states
✅ Type-safe components with TypeScript
✅ Protected routes with auth guard
✅ Responsive design with Tailwind CSS
✅ Reusable form components

## File Statistics

- **Configuration Files**: 5 (package.json, tsconfig.json, next.config.js, tailwind.config.js, postcss.config.js)
- **Type Definitions**: 1 file with 9+ types
- **Store/State**: 1 Zustand store
- **Custom Hooks**: 2 hooks for auth and API
- **Components**: 7 reusable components
- **Pages**: 10 page files (login, dashboard, 9 management pages)
- **Styles**: 1 global CSS file

## Performance Considerations

- SWR for data caching and revalidation
- Next.js Image optimization (when needed)
- Code splitting per route
- Lazy loading modals
- Minimal re-renders with React.memo (optional)

## Security Notes

- Tokens stored in localStorage (consider secure httpOnly cookies)
- API calls include Authorization header
- Protected routes check authentication
- Logout clears session
- Add CORS configuration as needed

## Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
Set in production:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```
