'use client'

import { NavBar, NavBrand, NavLinks, NavLinkItem } from '@/components/NavBar'
import { Layout, MainContent } from '@/components/Layout'
import { SectionCard } from '@/components/SectionCard'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

/**
 * Home page component with animations
 * Demonstrates composition pattern with modular components
 */
export default function Home() {
  const pathname = usePathname()

  return (
    <Layout>
      {/* Navigation Bar */}
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

      {/* Main Content Area */}
      <MainContent>
        {/* Page Header with Animations */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to My Portfolio
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Explore my professional journey, experiences, and interests with 30 years of frontend development expertise.
          </motion.p>
        </motion.div>

        {/* Sections Grid - Demonstrates responsive layout with Tailwind */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard
            title="About Me"
            description="Learn more about my background, skills, and what drives my passion for frontend development."
            href="/about"
            images={[
              'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            ]}
          />

          <SectionCard
            title="Resume"
            description="View my professional experience, education, and technical skills accumulated over decades."
            href="/resume"
            images={[
              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&w=400&q=80',
            ]}
          />

          <SectionCard
            title="Trips"
            description="Discover the amazing places I've traveled and the experiences I've collected around the world."
            href="/trips"
            images={[
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            ]}
          />

          <SectionCard
            title="Blogs"
            description="Read my thoughts on frontend development, best practices, and industry insights."
            href="/blogs"
            images={[
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
            ]}
          />

          <SectionCard
            title="Recipe"
            description="Explore my favorite recipes and culinary adventures outside of coding."
            href="/recipe"
            images={[
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
            ]}
          />

          <SectionCard
            title="Contact"
            description="Get in touch with me for collaboration opportunities or just to say hello."
            href="#contact"
            images={[
              'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
            ]}
          />
        </div>
      </MainContent>
    </Layout>
  )
}
