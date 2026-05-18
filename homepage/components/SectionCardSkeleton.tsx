'use client'

import { motion } from 'framer-motion'

export function SectionCardSkeleton() {
  return (
    <motion.div
      className="h-64 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-zinc-700 dark:to-zinc-800 rounded-lg animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export function SectionCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
      {Array.from({ length: count }).map((_, i) => (
        <SectionCardSkeleton key={i} />
      ))}
    </div>
  )
}
