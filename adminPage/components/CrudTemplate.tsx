'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Table, Modal, FormField, Input, Textarea } from '@/components'
import { useFetchAll, deleteItem } from '@/hooks/useApi'
import { ResourceType } from '@/types'

interface CrudTemplateProps {
  title: string
  resource: ResourceType
  columns: Array<{
    key: string
    label: string
  }>
  renderForm: (item: any | null, onChange: (data: any) => void, data: any) => React.ReactNode
  onSave: (data: any, id?: number) => Promise<void>
}

export function CrudTemplate({
  title,
  resource,
  columns,
  renderForm,
  onSave,
}: CrudTemplateProps) {
  const { items, isLoading, mutate } = useFetchAll(resource)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = () => {
    setSelectedItem(null)
    setFormData({})
    setIsModalOpen(true)
    setError('')
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setFormData(item)
    setIsModalOpen(true)
    setError('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      await deleteItem(resource, id)
      mutate()
    } catch (err) {
      setError('Failed to delete record')
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      setError('')
      await onSave(formData, selectedItem?.id)
      await mutate()
      setIsModalOpen(false)
      setFormData({})
      setSelectedItem(null)
    } catch (err: any) {
      setError(err.message || 'Failed to save record')
    } finally {
      setIsSaving(false)
    }
  }

  const tableColumns = columns.map((col) => ({
    key: col.key as any,
    label: col.label,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Record
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Table
        data={items}
        columns={tableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        title={selectedItem ? `Edit ${title}` : `Create ${title}`}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({})
          setSelectedItem(null)
        }}
        onSubmit={handleSubmit}
        submitLabel={selectedItem ? 'Update' : 'Create'}
        isLoading={isSaving}
      >
        {renderForm(selectedItem, setFormData, formData)}
      </Modal>
    </div>
  )
}
