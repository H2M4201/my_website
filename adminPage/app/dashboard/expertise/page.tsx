'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { ExpertiseCategory } from '@/types'

export default function ExpertisePage() {
  const handleSave = async (data: Partial<ExpertiseCategory>, id?: number) => {
    const payload = {
      ...data,
      skills: (data.skills || []).map((s: any, i: number) => ({
        skill: typeof s === 'string' ? s : s.skill,
        sortOrder: s.sortOrder ?? i,
      })),
    }
    if (id) {
      await updateItem('expertise', id, payload)
    } else {
      await createItem('expertise', payload)
    }
  }

  return (
    <CrudTemplate
      title="Expertise Categories"
      resource="expertise"
      columns={[
        { key: 'category', label: 'Category' },
      ]}
      renderForm={(item, onChange, data) => (
        <div className="space-y-4">
          <FormField label="Category Name" name="category" required>
            <Input
              name="category"
              value={data.category || ''}
              onChange={(e) => onChange({ ...data, category: e.target.value })}
            />
          </FormField>
          <FormField label="Sort Order" name="sortOrder">
            <Input
              name="sortOrder"
              type="number"
              value={String(data.sortOrder ?? 0)}
              onChange={(e) => onChange({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </FormField>

          {/* Skills */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-md font-semibold text-gray-200 mb-2">Skills</h3>
            {(data.skills || []).map((skill: any, index: number) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Input
                  className="flex-1"
                  value={skill.skill || skill}
                  onChange={(e) => {
                    const newSkills = [...(data.skills || [])]
                    newSkills[index] = { ...newSkills[index], skill: e.target.value, sortOrder: newSkills[index]?.sortOrder ?? index }
                    onChange({ ...data, skills: newSkills })
                  }}
                  placeholder="Skill name"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSkills = (data.skills || []).filter((_: any, i: number) => i !== index)
                    onChange({ ...data, skills: newSkills })
                  }}
                  className="text-red-400 hover:text-red-300 px-2 py-1 text-xl"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSkills = [...(data.skills || []), { skill: '', sortOrder: (data.skills || []).length }]
                onChange({ ...data, skills: newSkills })
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Add Skill
            </button>
          </div>
        </div>
      )}
      onSave={handleSave}
    />
  )
}