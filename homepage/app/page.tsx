'use client'


import { Layout, MainContent } from '@/components/Layout'
import { SectionCard } from '@/components/SectionCard'
import { motion } from 'framer-motion'

/**
 * Home page component with animations
 * Demonstrates composition pattern with modular components
 */
export default function Home() {
  return (
    <Layout>
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

        {/* About Me Content */}
        <section className="mb-16 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">About Me</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            I am a passionate frontend developer with 30 years of experience building beautiful, performant, and accessible web applications. My journey has taken me through countless projects, teams, and technologies, always with a focus on user experience and code quality.
          </p>
        </section>

        {/* Section Cards - 4x1 grid on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
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
        </div>

        {/* Contact Content */}
        <section id="contact" className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">Contact</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
            Interested in collaborating or just want to say hello? Feel free to reach out!
          </p>
          <a href="mailto:your.email@example.com" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
            Email Me
          </a>
        </section>
      </MainContent>
    </Layout>
  )
}
