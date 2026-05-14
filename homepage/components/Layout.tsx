'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { NavBar, NavBrand, NavLinks, NavLinkItem } from './NavBar'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Main layout component - ensures consistent structure and centralized navigation
 */
export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/resume', label: 'Resume' },
    { href: '/trips', label: 'Trips' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/recipe', label: 'Recipe' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300">
      <NavBar>
        <NavBrand>Portfolio</NavBrand>
        <NavLinks>
          {navItems.map((item) => (
            <NavLinkItem key={item.href} href={item.href} label={item.label} isActive={isActive(item.href)} />
          ))}
        </NavLinks>
      </NavBar>
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
