'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Contact } from '@/types'

export default function ContactsPage() {
  const handleSave = async (data: Partial<Contact>, id?: number) => {
    if (id) {
      await updateItem('contact', id, data)
    } else {
      await createItem('contact', data)
    }
  }

  return (
    <CrudTemplate
      title="Contacts"
      resource="contact"
      columns={[
        { key: 'type', label: 'Type' },
        { key: 'info', label: 'Information' },
        { key: 'icon', label: 'Icon' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Type" name="type" required>
            <Input
              name="type"
              value={data.type || ''}
              onChange={(e) => onChange({ ...data, type: e.target.value })}
            />
          </FormField>
          <FormField label="Contact Information" name="info" required>
            <Input
              name="info"
              value={data.info || ''}
              onChange={(e) => onChange({ ...data, info: e.target.value })}
            />
          </FormField>
          <FormField label="Icon" name="icon">
            <Input
              name="icon"
              value={data.icon || ''}
              onChange={(e) => onChange({ ...data, icon: e.target.value })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
