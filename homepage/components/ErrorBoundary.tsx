'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  message: string
  section?: 'sections' | 'contacts'
  onRetry?: () => void
}

export function ErrorBoundary({
  message,
  section = 'content',
  onRetry,
}: ErrorBoundaryProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-200">
            Failed to load {section}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
