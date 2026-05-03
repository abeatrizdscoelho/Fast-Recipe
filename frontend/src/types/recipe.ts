export type IngredientDTO = {
  name: string
  quantity: number
  unit: string
  category?: string
}

export type RecipeFormData = {
  title: string
  time: string
  ingredients: IngredientDTO[]
  preparation: string
  portions: string
  category: string
  photos: string[]
  difficulty: string
  description: string
  dietaryRestrictions: string[]
}

export type Recipe = {
  id: string
  title: string
  time: string
  ingredients: IngredientDTO[]
  preparation: string
  portions: string
  category: string
  dietaryRestrictions: string[]
  photo: string | null
  photoUrl: string | null
  photos: string[]
  favorite: boolean
  difficulty: string | null
  description: string | null
  authorId: string
  createdAt: string
}

export type FeedRecipe = {
  id: string
  title: string
  time: string
  ingredients: IngredientDTO[]
  preparation: string
  portions: string
  category: string
  dietaryRestrictions: string[]
  photos: string[]
  favorite: boolean
  difficulty: string | null
  description: string | null
  authorId: string
  createdAt: string
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

export type FeedResponse = {
  recipes: FeedRecipe[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
}

export type SavedFilters = {
  categories: string[]
  dietaryRestrictions: string[]
}