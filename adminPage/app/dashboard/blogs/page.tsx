'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Blog } from '@/types'

export default function BlogsPage() {
  const handleSave = async (data: Partial<Blog>, id?: number) => {
    if (id) {
      await updateItem('blog', id, data)
    } else {
      await createItem('blog', data)
    }
  }

  return (
    <CrudTemplate
      title="Blogs"
      resource="blog"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
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
          <FormField label="Content" name="content">
            <Textarea
              name="content"
              rows={8}
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
