'use client'

import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashCan, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

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
  onToggleActive?: (item: T) => void
  isLoading?: boolean
  getIsActive?: (item: T) => boolean
}

export function Table<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
  getIsActive,
}: TableProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-400">No records found</div>
  }

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
                    : String(item[col.key])}
                </td>
              ))}
              <td className="table-cell">
                <div className="flex items-center gap-3">
                  {onToggleActive && getIsActive && (
                    <button
                      onClick={() => onToggleActive(item)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        getIsActive(item)
                          ? 'bg-green-900/40 text-green-400 hover:bg-green-800/60'
                          : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
                      }`}
                      title={getIsActive(item) ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={getIsActive(item) ? faCheck : faXmark} className="mr-1" />
                      {getIsActive(item) ? 'Active' : 'Inactive'}
                    </button>
                  )}
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