'use client'

import { NavBar, NavBrand, NavLinks, NavLinkItem } from '@/components/NavBar'
import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Recipe() {
  const pathname = usePathname()
  
  // Sample recipe data
  const recipes = [
    { 
      id: 1, 
      title: 'Homemade Pasta', 
      cuisine: 'Italian',
      prep: '30 mins',
      description: 'Fresh pasta from scratch with simple ingredients.' 
    },
    { 
      id: 2, 
      title: 'Thai Green Curry', 
      cuisine: 'Thai',
      prep: '20 mins',
      description: 'Aromatic and spicy curry with fresh herbs.' 
    },
    { 
      id: 3, 
      title: 'Chocolate Mousse', 
      cuisine: 'French',
      prep: '15 mins',
      description: 'Decadent dessert that\'s surprisingly easy to make.' 
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recipes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{recipe.title}</h3>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>{recipe.cuisine}</span>
                  <span>{recipe.prep}</span>
                </div>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  View Recipe
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
