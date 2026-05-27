'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { JobDescription } from '@/types'

export default function JobDescriptionsPage() {
  const handleSave = async (data: Partial<JobDescription>, id?: number) => {
    if (id) {
      await updateItem('job-description', id, data)
    } else {
      await createItem('job-description', data)
    }
  }

  return (
    <CrudTemplate
      title="Job Descriptions"
      resource="job-description"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'description', label: 'Description' },
        { key: 'experienceId', label: 'Experience ID' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Description" name="description" required>
            <Textarea
              name="description"
              rows={3}
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
          </FormField>
          <FormField label="Experience ID" name="experienceId" required>
            <Input
              name="experienceId"
              type="number"
              value={String(data.experienceId || '')}
              onChange={(e) => onChange({ ...data, experienceId: parseInt(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Sort Order" name="sortOrder">
            <Input
              name="sortOrder"
              type="number"
              value={String(data.sortOrder ?? 0)}
              onChange={(e) => onChange({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}