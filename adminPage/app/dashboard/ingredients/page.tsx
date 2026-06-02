'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Ingredient } from '@/types'

export default function IngredientsPage() {
  const handleSave = async (data: Partial<Ingredient>, id?: number) => {
    if (id) {
      await updateItem('ingredient', id, data)
    } else {
      await createItem('ingredient', data)
    }
  }

  return (
    <CrudTemplate
      title="Ingredients"
      resource="ingredient"
      columns={[
        { key: 'ingredientName', label: 'Ingredient' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Ingredient Name" name="ingredientName" required>
            <Input
              name="ingredientName"
              value={data.ingredientName || ''}
              onChange={(e) => onChange({ ...data, ingredientName: e.target.value })}
            />
          </FormField>
        </div>
      )}
      onSave={handleSave}
    />
  )
}
