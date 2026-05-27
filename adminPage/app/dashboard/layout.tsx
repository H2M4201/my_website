import { Sidebar, ProtectedRoute } from '@/components'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex admin-main-bg min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
