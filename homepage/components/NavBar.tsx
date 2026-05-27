'use client'

import Link from 'next/link'
import React from 'react'

// NavBar component - composition pattern for modular, reusable UI
interface NavBarProps {
  children: React.ReactNode
}

/**
 * Main NavBar container component
 * Uses composition pattern for flexibility
 */
export function NavBar({ children }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 navbar-bg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {children}
        </div>
      </div>
    </nav>
  )
}

/**
 * NavBar Logo/Brand component with gradient
 */
export function NavBrand({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-3xl font-bold gradient-text hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
      {children}
    </div>
  )
}

/**
 * NavBar Links container component
 */
export function NavLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex items-center gap-1">
      {children}
    </div>
  )
}

interface NavLinkItemProps {
  href: string
  label: string
  isActive?: boolean
}

/**
 * Individual NavBar link component with smooth transitions
 * Applies accessibility best practices and modern styling
 */
export function NavLinkItem({ href, label, isActive = false }: NavLinkItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group ${
        isActive
          ? 'nav-link-active'
          : 'nav-link'
      }`}
    >
      {label}
      {!isActive && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      )}
    </Link>
  )
}