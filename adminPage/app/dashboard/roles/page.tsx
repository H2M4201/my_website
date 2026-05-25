'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Role } from '@/types'

export default function RolesPage() {
  const handleSave = async (data: Partial<Role>, id?: number) => {
    if (id) {
      await updateItem('role', id, data)
    } else {
      await createItem('role', data)
    }
  }

  return (
    <CrudTemplate
      title="Roles"
      resource="role"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Role Name" name="name" required>
            <Input
              name="name"
              value={data.name || ''}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
          </FormField>
          <FormField label="Description" name="description">
            <Textarea
              name="description"
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
