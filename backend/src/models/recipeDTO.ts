export interface CreateRecipeDTO {
  title: string
  ingredients: string[]
  preparation: string
  time: string
  portions: string
  category: string
  difficulty?: string
  description?: string
  dietaryRestrictions?: string[]
}

export interface RecipeDTO {
  id: string
  title: string
  ingredients: string[]
  preparation: string
  time: string
  portions: string
  category: string
  dietaryRestrictions: string[]
  difficulty: string | null
  description: string | null
  photos: string[]
  favorite: boolean
  authorId: string
  createdAt: string
}

export interface RecipeResponseDTO {
  recipe: RecipeDTO
}

export interface RecipeListResponseDTO {
  recipes: RecipeDTO[]
}

export interface FeedRecipe extends RecipeDTO {
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

export interface FeedResponseDTO {
  recipes: FeedRecipe[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
}