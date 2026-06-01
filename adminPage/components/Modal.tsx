'use client'

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  isLoading?: boolean
  size?: 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]',
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${sizeClasses[size]}`}>
        <div className="modal-header">
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">{children}</div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}