'use client'

import { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
  isLoading?: boolean
}

export function Table<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading,
}: TableProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-500">No records found</div>
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-3 text-sm text-gray-700">
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key])}
                </td>
              ))}
              <td className="px-6 py-3 text-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
