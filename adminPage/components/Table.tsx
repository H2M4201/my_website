'use client'

import { ReactNode, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashCan, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { updateItem } from '@/hooks/useApi'
import { ResourceType } from '@/types'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, item: T) => ReactNode
}

interface TableProps<T extends { id: number }> {
  data: T[]
  columns: Column<T>[]
  onEdit: (item: T) => void
  onDelete: (id: number) => void
  resource?: ResourceType
  isLoading?: boolean
  onToggleActive?: (item: T) => void
  getIsActive?: (item: T) => boolean
  onToggleSuccess?: () => void
}

export function Table<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  resource,
  isLoading,
  onToggleActive,
  getIsActive,
  onToggleSuccess,
}: TableProps<T>) {
  const [togglingId, setTogglingId] = useState<number | null>(null)

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-400">No records found</div>
  }

  // Auto-detect if items have an isActive field
  const hasIsActiveField = data.some((item) => 'isActive' in item)
  const isActiveInColumns = columns.some((col) => col.key === 'IsActive')
  const effectiveGetIsActive = getIsActive || ((item: any) => item.isActive)

  // Default toggle handler: uses resource to make the API call automatically
  const handleDefaultToggle = async (item: T) => {
    if (!resource) return
    setTogglingId(item.id)
    try {
      await updateItem(resource, item.id, { isActive: !effectiveGetIsActive(item) })
      onToggleSuccess?.()
    } catch (err) {
      console.error('Failed to toggle active status:', err)
    } finally {
      setTogglingId(null)
    }
  }

  // Use custom onToggleActive if provided, otherwise use default (if resource is available)
  const handleToggle = onToggleActive || (resource ? handleDefaultToggle : undefined)

  // Show toggle column when items have isActive and it's not already in columns
  const showActiveColumn = hasIsActiveField && !isActiveInColumns

  return (
    <div className="table-container">
      <table className="w-full">
        <thead className="table-header">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="table-header-cell"
              >
                {col.label}
              </th>
            ))}
            {showActiveColumn && (
              <th className="table-header-cell">Active</th>
            )}
            <th className="table-header-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
              {columns.map((col) => (
                <td key={String(col.key)} className="table-cell">
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key] ?? '')}
                </td>
              ))}
              {showActiveColumn && (
                <td className="table-cell">
                  {handleToggle ? (
                    <button
                      onClick={() => handleToggle(item)}
                      disabled={togglingId === item.id}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        togglingId === item.id
                          ? 'opacity-50 cursor-wait'
                          : ''
                      } ${
                        effectiveGetIsActive(item)
                          ? 'bg-green-900/40 text-green-400 hover:bg-green-800/60'
                          : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
                      }`}
                      title={effectiveGetIsActive(item) ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={effectiveGetIsActive(item) ? faCheck : faXmark} className="mr-1" />
                      {effectiveGetIsActive(item) ? 'Active' : 'Inactive'}
                    </button>
                  ) : (
                    <span className={`text-xs font-medium ${effectiveGetIsActive(item) ? 'text-green-400' : 'text-red-400'}`}>
                      {effectiveGetIsActive(item) ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
              )}
              <td className="table-cell">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}