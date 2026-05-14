'use client'

import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'

/**
 * About page component
 * Demonstrates modular component composition
 */
export default function About() {
  return (
    <Layout>
      <MainContent>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">About Me</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Hello! I'm a senior frontend developer with 30 years of experience in crafting exceptional digital experiences.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Throughout my career, I've witnessed the evolution of web technologies and have consistently stayed at the forefront of modern development practices. My expertise spans React, Next.js, TypeScript, and various styling solutions including Tailwind CSS.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              I'm passionate about building accessible, performant, and maintainable user interfaces. I believe in clean code, thoughtful design patterns, and the importance of user-centric development.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Beyond coding, I love traveling, exploring new cuisines, and sharing knowledge with the developer community.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block mt-8 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
             ← Back Home
          </Link>
        </div>
      </MainContent>
    </Layout>
  )
}
