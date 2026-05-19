export type PantryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiresAt: string | null
  createdAt: string
}

export type PantryListResponse = {
  items: PantryItem[]
}

export type PantryItemResponse = {
  item: PantryItem
}

export type AddPantryItemPayload = {
  name: string
  quantity: number
  unit: string
  category: string
  expiresAt?: string | null
}

export type UpdatePantryItemPayload = {
  name?: string
  quantity?: number
  unit?: string
  category?: string
  expiresAt?: string | null
}

export type PantrySuggestion = {
  id: string
  title: string
  time: string
  difficulty: string | null
  description: string | null
  photos: string[]
  category: string
  favorite: boolean
  authorId: string
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
  matchCount: number
  matchPercentage: number
  createdAt: string
}

export type PantrySuggestionsResponse = {
  suggestions: PantrySuggestion[]
  message?: string
}

export type PantryItemModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; item: PantryItem }