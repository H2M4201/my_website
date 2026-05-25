import useSWR from 'swr'
import { ResourceType } from '@/types'

// ===== Centralized API configuration =====
// Read operations use the public /api/v1/ prefix (shared with homepage)
// Write operations use the admin /api/v1/admin/ prefix
export const ADMIN_WRITE_PREFIX = '/api/v1/admin'
export const PUBLIC_READ_PREFIX = '/api/v1'

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side
    return (process.env.API_URL || 'https://localhost:4000').replace(/\/$/, '')
  }
  // Client-side: use NEXT_PUBLIC variable
  return (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:4000').replace(/\/$/, '')
}

const READ_BASE_URL = `${getApiBaseUrl()}${PUBLIC_READ_PREFIX}`
const WRITE_BASE_URL = `${getApiBaseUrl()}${ADMIN_WRITE_PREFIX}`

const fetcher = (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  console.log(`[AdminPage] 🚀 GET ${url}`)
  return fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  }).then((res) => {
    if (!res.ok) {
      console.error(`[AdminPage] ❌ GET ${url} → ${res.status}`)
      throw new Error('API Error')
    }
    console.log(`[AdminPage] ✅ GET ${url} → ${res.status}`)
    return res.json()
  })
}

export function useFetchAll<T>(resource: ResourceType) {
  const { data, error, isLoading, mutate } = useSWR<T[]>(
    `${READ_BASE_URL}/${resource}s`,
    fetcher
  )

  return {
    items: data || [],
    error,
    isLoading,
    mutate,
  }
}

export function useFetchOne<T>(resource: ResourceType, id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    id ? `${READ_BASE_URL}/${resource}s/${id}` : null,
    fetcher
  )

  return {
    item: data || null,
    error,
    isLoading,
    mutate,
  }
}

export async function createItem<T>(resource: ResourceType, data: unknown): Promise<T> {
  const token = localStorage.getItem('authToken')
  const url = `${WRITE_BASE_URL}/create/${resource}`
  console.log(`[AdminPage] 🚀 POST ${url}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error(`[AdminPage] ❌ POST ${url} → ${response.status}`, errorData)
    throw new Error(errorData?.error || 'Failed to create')
  }
  console.log(`[AdminPage] ✅ POST ${url} → ${response.status}`)
  return response.json()
}

export async function updateItem<T>(
  resource: ResourceType,
  id: number,
  data: unknown
): Promise<T> {
  const token = localStorage.getItem('authToken')
  const url = `${WRITE_BASE_URL}/update/${resource}/${id}`
  console.log(`[AdminPage] 🚀 PATCH ${url}`)
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error(`[AdminPage] ❌ PATCH ${url} → ${response.status}`, errorData)
    throw new Error(errorData?.error || 'Failed to update')
  }
  console.log(`[AdminPage] ✅ PATCH ${url} → ${response.status}`)
  return response.json()
}

export async function deleteItem(resource: ResourceType, id: number): Promise<void> {
  const token = localStorage.getItem('authToken')
  const url = `${WRITE_BASE_URL}/delete/${resource}/${id}`
  console.log(`[AdminPage] 🚀 DELETE ${url}`)
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error(`[AdminPage] ❌ DELETE ${url} → ${response.status}`, errorData)
    throw new Error(errorData?.error || 'Failed to delete')
  }
  console.log(`[AdminPage] ✅ DELETE ${url} → ${response.status}`)
}