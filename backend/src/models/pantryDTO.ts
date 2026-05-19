export interface PantryItemDTO {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiresAt: string | null
  createdAt: string
}

export interface PantryItemResponseDTO {
  item: PantryItemDTO
}

export interface PantryListResponseDTO {
  items: PantryItemDTO[]
}

export interface PantrySuggestionDTO {
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

export interface PantrySuggestionsResponseDTO {
  suggestions: PantrySuggestionDTO[]
  message?: string
}

export interface CreatePantryItemDTO {
  name: string
  quantity: number
  unit: string
  category: string
  expiresAt?: string | null
}

export interface UpdatePantryItemDTO {
  name?: string
  quantity?: number
  unit?: string
  category?: string
  expiresAt?: string | null
}