'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { AdminUser } from '@/types'

export default function UsersPage() {
  const handleSave = async (data: Partial<AdminUser>, id?: number) => {
    if (id) {
      await updateItem('user', id, data)
    } else {
      await createItem('user', data)
    }
  }

  return (
    <CrudTemplate
      title="Users"
      resource="user"
      columns={[
        { key: 'email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'roleId', label: 'Role ID' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Email" name="email" required>
            <Input
              type="email"
              name="email"
              value={data.email || ''}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
            />
          </FormField>
          <FormField label="Name" name="name" required>
            <Input
              name="name"
              value={data.name || ''}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
          </FormField>
          <FormField label="Role ID" name="roleId" required>
            <Input
              type="number"
              name="roleId"
              value={data.roleId || ''}
              onChange={(e) =>
                onChange({ ...data, roleId: parseInt(e.target.value) })
              }
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
