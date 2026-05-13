'use client'

import { NavBar, NavBrand, NavLinks, NavLinkItem } from '@/components/NavBar'
import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Trips() {
  const pathname = usePathname()

  // Sample trip data
  const trips = [
    { id: 1, title: 'Tokyo, Japan', description: 'Amazing street food and cutting-edge technology' },
    { id: 2, title: 'Paris, France', description: 'The city of light and unforgettable experiences' },
    { id: 3, title: 'Bali, Indonesia', description: 'Tropical paradise with rich cultural heritage' },
  ] // <-- Make sure this is the only closing bracket here

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Trips</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{trip.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{trip.description}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  Read Story
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