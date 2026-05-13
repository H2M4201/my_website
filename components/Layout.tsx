import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Main layout component - ensures consistent structure across pages
 * Composition pattern for clean, maintainable code
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300">
      {children}
    </div>
  )
}

/**
 * Main content wrapper - centers content with improved spacing and styling
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
      {children}
    </main>
  )
}
