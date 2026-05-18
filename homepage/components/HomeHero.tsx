'use client'

import { motion } from 'framer-motion'

/**
 * Client-only hero: framer-motion must not run in the app Router Server Component (page.tsx).
 */
export function HomeHero() {
  return (
    <motion.div
      className="mb-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-6xl md:text-7xl font-bold mb-2 pb-4 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to H2M's Homepage
      </motion.h1>
    </motion.div>
  )
}
