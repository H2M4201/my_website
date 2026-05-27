'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks'

interface NavGroup {
  label: string
  icon?: string
  children: { label: string; href: string }[]
}

const NAV_GROUPS: (NavGroup | { label: string; href: string })[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Sections', href: '/dashboard/sections' },
  { label: 'Contacts', href: '/dashboard/contacts' },
  { label: 'Blogs', href: '/dashboard/blogs' },
  { label: 'Recipes', href: '/dashboard/recipes' },
  { label: 'Trips', href: '/dashboard/trips' },
  {
    label: 'Resume',
    children: [
      { label: 'Resume', href: '/dashboard/resumes' },
      { label: 'Experiences', href: '/dashboard/experiences' },
      { label: 'Job Descriptions', href: '/dashboard/job-descriptions' },
      { label: 'Expertise', href: '/dashboard/expertise' },
    ],
  },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Roles', href: '/dashboard/roles' },
  { label: 'Permissions', href: '/dashboard/permissions' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Resume: true,
  })

  const handleLogout = () => {
    logout()
  }

  const isActive = (href: string) => pathname === href

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isChildActive = (children: { href: string }[]) => {
    return children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
  }

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen transition-all duration-300 z-50 sidebar-bg ${isOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAV_GROUPS.map((item) => {
            if ('children' in item) {
              const expanded = expandedGroups[item.label] ?? true
              const groupActive = isChildActive(item.children)
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded transition ${
                      groupActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    title={!isOpen ? item.label : undefined}
                  >
                    {isOpen ? (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </>
                    ) : (
                      <span className="mx-auto">{item.label[0]}</span>
                    )}
                  </button>
                  {isOpen && expanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 text-sm rounded transition ${
                            isActive(child.href)
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <span className="whitespace-nowrap">
                  {isOpen ? item.label : item.label[0]}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-2 right-2 space-y-2">
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