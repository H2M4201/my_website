'use client'

import { useAuth } from '@/hooks'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h1 className="dashboard-title mb-2">Welcome to Admin Dashboard</h1>
        <p className="dashboard-text">Manage your portfolio content and user accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-lg text-gray-100 mb-2">Content Management</h3>
          <p className="dashboard-text text-sm">Manage sections, contacts, blogs, recipes, and trips</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-lg text-gray-100 mb-2">Resume Management</h3>
          <p className="dashboard-text text-sm">Update your resume and professional information</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-lg text-gray-100 mb-2">User Management</h3>
          <p className="dashboard-text text-sm">Manage users, roles, and permissions</p>
        </div>
      </div>

      {user && (
        <div className="card p-6 dashboard-card-accent">
          <p className="text-sm dashboard-text">
            Logged in as: <span className="font-semibold text-gray-100">{user.email}</span>
          </p>
        </div>
      )}
    </div>
  )
}