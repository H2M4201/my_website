# Admin Dashboard

A Next.js-based admin dashboard for managing portfolio content and user accounts.

## Features

- **Authentication**: Login page with session management
- **Dashboard**: Overview of all management features
- **9 Management Modules**: Sections, Contacts, Blogs, Recipes, Trips, Resumes, Users, Roles, Permissions
- **CRUD Operations**: Create, Read, Update, Delete for all resources
- **Responsive UI**: Built with Tailwind CSS and shadcn components
- **Type-Safe**: Full TypeScript support
- **State Management**: Zustand for auth state, SWR for data fetching

## Project Structure

```
adminPage/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── login/                   # Login page
│   └── dashboard/               # Dashboard and management pages
│       ├── layout.tsx           # Dashboard layout with sidebar
│       ├── page.tsx             # Dashboard home
│       ├── sections/
│       ├── contacts/
│       ├── blogs/
│       ├── recipes/
│       ├── trips/
│       ├── resumes/
│       ├── users/
│       ├── roles/
│       └── permissions/
├── components/                   # React components
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── Table.tsx                # Data table component
│   ├── Modal.tsx                # Modal dialog
│   ├── Form.tsx                 # Form components
│   ├── ProtectedRoute.tsx       # Auth guard
│   └── CrudTemplate.tsx         # Reusable CRUD template
├── hooks/                        # Custom hooks
│   ├── useApi.ts                # API fetching hooks
│   └── useAuth.ts               # Authentication hook
├── lib/                          # Utilities
├── store/                        # Zustand stores
│   └── authStore.ts             # Authentication store
└── types/                        # TypeScript types
    └── index.ts                 # Type definitions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create .env.local:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3001 in browser

## Features by Page

### Login Page
- Email/password authentication
- Session persistence with localStorage
- Error handling and validation

### Dashboard Home
- Welcome message
- Quick overview of all features
- Current user information display

### Management Pages

Each management page supports:

#### View All Records
- Table view of all resources
- Sortable columns
- Pagination ready
- Loading and empty states

#### Create Record
- Modal form for new entries
- Field validation
- Cancel and submit buttons
- Success/error feedback

#### Edit Record
- Select record from table
- Modal opens with existing data
- Partial updates supported
- Confirmation on action

#### Delete Record
- Confirmation dialog
- Single or bulk delete capable
- Error handling
- Automatic list refresh

### Resources

1. **Sections** - Page sections with title, description, link
2. **Contacts** - Contact info (email, phone, social) with icon
3. **Blogs** - Blog posts with title, description, content
4. **Recipes** - Recipe storage with name and description
5. **Trips** - Travel logs with title, location, time, content
6. **Resumes** - Resume documents with title and content
7. **Users** - Admin users with email, name, role assignment
8. **Roles** - User roles with name and description
9. **Permissions** - Access permissions with name and description

## API Integration

### Base API URL
```
http://localhost:5000/api
```

### Endpoints Pattern
All resources follow RESTful conventions:
```
GET    /api/{resource}s           # List all
GET    /api/{resource}s/:id       # Get single
POST   /api/{resource}s           # Create
PATCH  /api/{resource}s/:id       # Update
DELETE /api/{resource}s/:id       # Delete
DELETE /api/{resource}s           # Delete all
```

## Component Usage

### CrudTemplate
Reusable component for all management pages:
```tsx
<CrudTemplate
  title="Sections"
  resource="section"
  columns={[...]}
  renderForm={(item, onChange, data) => {...}}
  onSave={handleSave}
/>
```

### useAuth Hook
Access authentication state:
```tsx
const { user, isAuthenticated, login, logout } = useAuth()
```

### useApi Hooks
Fetch and manage data:
```tsx
const { items, isLoading, error, mutate } = useFetchAll('section')
const { item, isLoading } = useFetchOne('section', id)
await createItem('section', data)
await updateItem('section', id, data)
await deleteItem('section', id)
```

## Authentication Flow

1. User navigates to `/login`
2. Enters email and password
3. API validates credentials
4. Token stored in localStorage
5. Redirected to `/dashboard`
6. Session restored on page reload
7. Logout clears token and redirect to login

## Protected Routes

All dashboard routes are protected by `ProtectedRoute` component:
- Checks authentication status
- Redirects to login if not authenticated
- Restores session on mount
- Shows loading state during auth check

## Navigation

### Sidebar Menu
- Dashboard (home)
- Sections
- Contacts
- Blogs
- Recipes
- Trips
- Resumes
- Users
- Roles
- Permissions

### Navigation Features
- Collapsible sidebar
- Active route highlighting
- Mobile responsive
- Logout button

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Pre-configured with custom colors
- Responsive design
- Dark mode ready

### Custom Classes
```css
.btn-primary        /* Blue primary button */
.btn-secondary      /* Gray secondary button */
.btn-danger         /* Red danger button */
.card               /* White rounded card with shadow */
.container-main     /* Max-width container */
```

## Development

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Route-specific components
- **Hooks**: Custom React hooks
- **Types**: TypeScript interfaces
- **Store**: Global state (Zustand)
- **Lib**: Utilities and helpers

### Best Practices
- Component composition over inheritance
- Type safety with TypeScript
- Proper error handling
- Loading states for async operations
- Accessible form components

## Next Steps

1. Connect to backend API
2. Add authentication endpoints
3. Add models for User, Role, Permission
4. Implement advanced filtering/search
5. Add export/import functionality
6. Add audit logging
7. Implement bulk operations
8. Add advanced form validation

## Notes

- Auth tokens expire on logout (localStorage cleared)
- API calls include Authorization header with token
- All forms validate before submission
- Modals can be dismissed with Cancel button
- Sidebar is collapsible for more space
- Tables show loading state while fetching
