import type { ContactDTO, SectionDTO } from './dto'

function getApiBaseUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:4000'
  ).replace(/\/$/, '')
}

/**
 * Fetches the standalone backend API (see `../backend`).
 * Used from Server Components during SSR; `API_URL` should point to the backend from the Next server.
 */
export async function getAllSections(): Promise<SectionDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/sections`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch sections`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getAllSections error:', error)
    throw error
  }
}

export async function getSectionById(id: number): Promise<SectionDTO> {
  try {
    const url = `${getApiBaseUrl()}/api/sections/${id}`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Section not found`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getSectionById error:', error)
    throw error
  }
}

export async function getAllContacts(): Promise<ContactDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/contacts`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch contacts`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getAllContacts error:', error)
    throw error
  }
}
