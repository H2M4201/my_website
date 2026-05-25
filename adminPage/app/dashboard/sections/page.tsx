'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Section } from '@/types'

export default function SectionsPage() {
  const handleSave = async (data: Partial<Section>, id?: number) => {
    if (id) {
      await updateItem('section', id, data)
    } else {
      await createItem('section', data)
    }
  }

  return (
    <CrudTemplate
      title="Sections"
      resource="section"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'href', label: 'Link' },
      ]}
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
            <Textarea
              name="description"
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
          </FormField>
          <FormField label="Link (href)" name="href">
            <Input
              name="href"
              value={data.href || ''}
              onChange={(e) => onChange({ ...data, href: e.target.value })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
