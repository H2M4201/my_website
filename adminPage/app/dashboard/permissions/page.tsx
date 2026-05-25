'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Permission } from '@/types'

export default function PermissionsPage() {
  const handleSave = async (data: Partial<Permission>, id?: number) => {
    if (id) {
      await updateItem('permission', id, data)
    } else {
      await createItem('permission', data)
    }
  }

  return (
    <CrudTemplate
      title="Permissions"
      resource="permission"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Permission Name" name="name" required>
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
