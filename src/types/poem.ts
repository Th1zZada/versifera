export interface Poem {
  id: string
  title: string
  category: string
  excerpt: string | null
  content: string
  published: boolean
  featured: boolean
  created_at: string
}