'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Resume } from '@/types'

export default function ResumesPage() {
  const handleSave = async (data: Partial<Resume>, id?: number) => {
    if (id) {
      await updateItem('resume', id, data)
    } else {
      await createItem('resume', data)
    }
  }

  return (
    <CrudTemplate
      title="Resumes"
      resource="resume"
      columns={[
        { key: 'title', label: 'Title' },
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
          <FormField label="Content" name="content">
            <Textarea
              name="content"
              rows={12}
              value={data.content || ''}
              onChange={(e) => onChange({ ...data, content: e.target.value })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
