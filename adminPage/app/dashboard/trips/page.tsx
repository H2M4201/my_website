'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input } from '@/components'
import { BlogEditor } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Trip } from '@/types'

export default function TripsPage() {
  const handleSave = async (data: Partial<Trip>, id?: number) => {
    if (id) {
      await updateItem('trip', id, data)
    } else {
      await createItem('trip', data)
    }
  }

  return (
    <CrudTemplate
      title="Trips"
      resource="trip"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'location', label: 'Location' },
        { key: 'time', label: 'Time' },
      ]}
      modalSize="xl"
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Title" name="title" required>
            <Input
              name="title"
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
          </FormField>
          <FormField label="Description" name="description">
            <Input
              name="description"
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
          </FormField>
          <FormField label="Location" name="location">
            <Input
              name="location"
              value={data.location || ''}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
            />
          </FormField>
          <FormField label="Time" name="time">
            <Input
              name="time"
              value={data.time || ''}
              onChange={(e) => onChange({ ...data, time: e.target.value })}
            />
          </FormField>
          <FormField label="Content" name="content">
            <BlogEditor
              value={data.content || ''}
              onChange={(html) => onChange({ ...data, content: html })}
              minHeight={300}
              placeholder="Start writing your trip content..."
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}