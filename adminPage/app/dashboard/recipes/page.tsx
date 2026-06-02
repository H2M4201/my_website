'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { BlogEditor } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Recipe } from '@/types'

interface Ingredient {
  id: string
  name: string
  amount: string
}

export default function RecipesPage() {
  const handleSave = async (data: Partial<Recipe>, id?: number) => {
    // Serialize ingredients array to JSON string for storage
    const payload = {
      ...data,
      ingredients: data.ingredients || null,
      steps: data.steps || null,
    }
    if (id) {
      await updateItem('recipe', id, payload)
    } else {
      await createItem('recipe', payload)
    }
  }

  return (
    <CrudTemplate
      title="Recipes"
      resource="recipe"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ]}
      modalSize="xl"
      renderForm={(item, onChange, data) => (
        <RecipeForm item={item} onChange={onChange} data={data} />
      )}
      onSave={handleSave}
    />
  )
}

function RecipeForm({
  item,
  onChange,
  data,
}: {
  item: any
  onChange: (data: any) => void
  data: any
}) {
  // Parse ingredients from stored JSON string, or initialize empty
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    if (data.ingredients) {
      try {
        return JSON.parse(data.ingredients)
      } catch {
        return []
      }
    }
    return []
  })

  const updateIngredients = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients)
    onChange({ ...data, ingredients: JSON.stringify(newIngredients) })
  }

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      amount: '',
    }
    updateIngredients([...ingredients, newIngredient])
  }

  const removeIngredient = (id: string) => {
    updateIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    updateIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <FormField label="Recipe Name" name="name" required>
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
          rows={3}
        />
      </FormField>

      {/* Ingredients Section */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold text-gray-200">Ingredients</h3>
          <button
            type="button"
            onClick={addIngredient}
            className="btn-primary flex items-center gap-1 text-sm py-1 px-3"
          >
            <Plus size={16} />
            Add Ingredient
          </button>
        </div>

        {ingredients.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No ingredients added yet. Click "Add Ingredient" to start.
          </p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="flex items-start gap-2 bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 pt-2 text-gray-500">
                  <GripVertical size={16} className="cursor-grab" />
                  <span className="text-xs font-mono w-5 text-right">
                    {index + 1}.
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Ingredient
                    </label>
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, 'name', e.target.value)
                      }
                      placeholder="e.g. Flour"
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, 'amount', e.target.value)
                      }
                      placeholder="e.g. 2 cups"
                      className="form-input text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors mt-5"
                  title="Remove ingredient"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Steps Section */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-md font-semibold text-gray-200 mb-3">
          Cooking Steps
        </h3>
        <FormField label="Steps" name="steps">
          <BlogEditor
            value={data.steps || ''}
            onChange={(html) => onChange({ ...data, steps: html })}
            minHeight={300}
            placeholder="Write the cooking steps here... You can use headings, lists, bold, and other formatting."
          />
        </FormField>
      </div>
    </div>
  )
}