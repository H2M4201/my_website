
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'


interface SectionCardProps {
  title: string
  description: string
  href: string
  images?: string[]
  variant?: 'default' | 'outlined'
}

/**
 * SectionCard component - composition pattern for reusable card UI
 * Displays section summary with link to detailed page
 */
export function SectionCard({
  title,
  description,
  href,
  images = [],
  variant = 'default',
}: SectionCardProps) {
  const [current, setCurrent] = React.useState(0)
  const hasImages = images && images.length > 0
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0,
      },
    },
  }
  
  const baseStyles = 'relative flex flex-col h-full p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 bg-white dark:bg-slate-900 hover:shadow-2xl dark:hover:shadow-2xl hover:-translate-y-2'
  const variantStyles = {
    default: 'hover:border-blue-400 dark:hover:border-blue-500',
    outlined: 'border-2 border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-400',
  }

  // Slider controls
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent((prev) => (prev + 1) % images.length)
  }
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`${baseStyles} ${variantStyles[variant]} group`}
    >
      {/* Image slider */}
      {hasImages && (
        <div className="relative w-full aspect-[16/9] bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <img
            src={images[current]}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-900/70 rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition-colors"
                tabIndex={0}
              >
                &#8592;
              </button>
              <button
                aria-label="Next image"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-900/70 rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition-colors"
                tabIndex={0}
              >
                &#8594;
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`block w-2 h-2 rounded-full ${i === current ? 'bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-600'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {/* Card content */}
      <div className="flex-1 flex flex-col px-8 py-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
        <div className="flex-1" />
        {/* Bottom link */}
        <motion.div 
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end items-end mt-2"
        >
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white dark:text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
          >
            Learn More <span aria-hidden className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
