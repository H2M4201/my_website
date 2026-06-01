'use client'

import { CrudTemplate } from '@/components/CrudTemplate'
import { FormField, Input, Textarea } from '@/components'
import { createItem, updateItem } from '@/hooks/useApi'
import { Experience } from '@/types'

export default function ExperiencesPage() {
  const handleSave = async (data: Partial<Experience>, id?: number) => {
    const payload = {
      ...data,
      jobDescriptions: (data.jobDescriptions || []).map((jd: any, i: number) => ({
        description: typeof jd === 'string' ? jd : jd.description,
        sortOrder: jd.sortOrder ?? i,
      })),
      skills: (data.skills || []).map((s: any, i: number) => ({
        skill: typeof s === 'string' ? s : s.skill,
        sortOrder: s.sortOrder ?? i,
      })),
    }
    if (id) {
      await updateItem('experience', id, payload)
    } else {
      await createItem('experience', payload)
    }
  }

  return (
    <CrudTemplate
      title="Experience"
      resource="experience"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'company', label: 'Company' },
        { key: 'period', label: 'Period' },
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
          <FormField label="Company" name="company" required>
            <Input
              name="company"
              value={data.company || ''}
              onChange={(e) => onChange({ ...data, company: e.target.value })}
            />
          </FormField>
          <FormField label="Period" name="period" required>
            <Input
              name="period"
              value={data.period || ''}
              onChange={(e) => onChange({ ...data, period: e.target.value })}
            />
          </FormField>
          <FormField label="Achievement" name="achievement">
            <Textarea
              name="achievement"
              rows={3}
              value={data.achievement || ''}
              onChange={(e) => onChange({ ...data, achievement: e.target.value })}
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
            <div className="flex flex-wrap gap-2 mb-2">
              {(data.skills || []).map((skill: any, index: number) => (
                <div key={index} className="inline-flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
                  <input
                    className="bg-transparent text-gray-100 outline-none min-w-[60px] text-sm"
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
                    className="text-red-400 hover:text-red-300 text-sm leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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