import type {
  BlogDTO,
  TripDTO,
  ContactDTO,
  SectionDTO,
  ExperienceDTO,
  ExpertiseCategoryDTO,
} from '@/lib/dto'

function getApiBaseUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://127.0.0.1:4000'
  ).replace(/\/$/, '')
}

/**
 * Fetches the standalone backend API (see `../backend`).
 * Used from Server Components during SSR; `API_URL` should point to the backend from the Next server.
 */
/** Default revalidation in seconds (fallback if webhook fails) */
const DEFAULT_REVALIDATION = 60 // 1 minute fallback

export async function getAllSections(): Promise<SectionDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/sections`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['sections'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch sections`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllSections error:', error)
    throw error
  }
}

export async function getSectionById(id: number): Promise<SectionDTO> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/sections/${id}`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['sections'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Section not found`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status}`)
    return data
  } catch (error) {
    console.error('[Homepage] getSectionById error:', error)
    throw error
  }
}

export async function getAllContacts(): Promise<ContactDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/contacts`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['contacts'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch contacts`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllContacts error:', error)
    throw error
  }
}

export async function getAllBlogs(): Promise<BlogDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/blogs`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['blogs'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch blogs`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllBlogs error:', error)
    throw error
  }
}

export async function getBlogById(id: number): Promise<BlogDTO> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/blogs/${id}`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['blogs'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch blog`) 
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status}`)
    return data
  } catch (error) {
    console.error('[Homepage] getBlogById error:', error)
    throw error
  }
}

export async function getAllTrips(): Promise<TripDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/trips`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['trips'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch trips`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllTrips error:', error)
    throw error
  }
}

export async function getTripById(id: number): Promise<TripDTO> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/trips/${id}`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['trips'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch trip`) 
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status}`)
    return data
  } catch (error) {
    console.error('[Homepage] getTripById error:', error)
    throw error
  }
}

// ===== Resume API Functions =====

export async function getAllExperiences(): Promise<ExperienceDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/resume/experiences`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['resume'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch experiences`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllExperiences error:', error)
    throw error
  }
}

export async function getAllExpertiseCategories(): Promise<ExpertiseCategoryDTO[]> {
  try {
    const url = `${getApiBaseUrl()}/api/v1/resume/expertise`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['resume'], revalidate: DEFAULT_REVALIDATION },
    })
    console.log(`[Homepage] 🚀 GET ${url}`)

    if (!response.ok) {
      console.error(`[Homepage] ❌ GET ${url} → ${response.status}`)
      throw new Error(`HTTP ${response.status}: Failed to fetch expertise categories`)
    }

    const data = await response.json()
    console.log(`[Homepage] ✅ GET ${url} → ${response.status} (${Array.isArray(data) ? data.length : 1} items)`)
    return data
  } catch (error) {
    console.error('[Homepage] getAllExpertiseCategories error:', error)
    throw error
  }
}

export type {
  ContactDTO,
  SectionDTO, 
  ExperienceDTO,
  ExpertiseCategoryDTO,
} from '@/lib/dto'