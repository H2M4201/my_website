'use client'

import { NavBar, NavBrand, NavLinks, NavLinkItem } from '@/components/NavBar'
import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Blogs() {
  const pathname = usePathname()
  
  // Sample blog data
  const blogs = [
    { 
      id: 1, 
      title: 'Modern Frontend Patterns', 
      date: 'May 2024',
      excerpt: 'Exploring composition patterns, hooks, and best practices in React development.' 
    },
    { 
      id: 2, 
      title: 'Performance Optimization Tips', 
      date: 'April 2024',
      excerpt: 'Techniques for improving web application performance and user experience.' 
    },
    { 
      id: 3, 
      title: 'Accessibility in Web Design', 
      date: 'March 2024',
      excerpt: 'Building inclusive digital products that work for everyone.' 
    },
  ]

  return (
    <Layout>
      <NavBar>
        <NavBrand>Portfolio</NavBrand>
        <NavLinks>
          <NavLinkItem href="/" label="Home" isActive={pathname === '/'} />
          <NavLinkItem href="/about" label="About Me" isActive={pathname === '/about'} />
          <NavLinkItem href="/resume" label="Resume" isActive={pathname === '/resume'} />
          <NavLinkItem href="/trips" label="Trips" isActive={pathname === '/trips'} />
          <NavLinkItem href="/blogs" label="Blogs" isActive={pathname === '/blogs'} />
          <NavLinkItem href="/recipe" label="Recipe" isActive={pathname === '/recipe'} />
        </NavLinks>
      </NavBar>

      <MainContent>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Blog Articles</h1>
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{blog.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{blog.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.excerpt}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  Read Article
                </button>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="inline-block mt-8 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            ← Back Home
          </Link>
        </div>
      </MainContent>
    </Layout>
  )
}
