'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Sections', href: '/dashboard/sections' },
  { label: 'Contacts', href: '/dashboard/contacts' },
  { label: 'Blogs', href: '/dashboard/blogs' },
  { label: 'Recipes', href: '/dashboard/recipes' },
  { label: 'Trips', href: '/dashboard/trips' },
  { label: 'Resumes', href: '/dashboard/resumes' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Roles', href: '/dashboard/roles' },
  { label: 'Permissions', href: '/dashboard/permissions' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <span className="whitespace-nowrap">
                {isOpen ? item.label : item.label[0]}
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-2 right-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
            title="Logout"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Main content goes here */}
      </div>
    </>
  )
}
