/** Shapes returned by the portfolio backend API (see `backend/`). */

export interface SectionDTO {
  id: number
  title: string
  description: string | null
  href: string | null
}

export interface ContactDTO {
  id: number
  type: string
  info: string
  icon: string | null
}
