export interface CreateRecipeDTO {
  title: string
  ingredients: string[]
  preparation: string
  time: string
  portions: string
  category: string
  difficulty?: string
  description?: string
}

export interface RecipeResponseDTO {
  recipe: {
    id: string
    title: string
    ingredients: string[]
    preparation: string
    time: string
    portions: string
    category: string
    difficulty: string | null
    description: string | null
    photos: string[]
    favorite: boolean
    authorId: string
    createdAt: string
  }
}

export interface RecipeListResponseDTO {
  recipes: RecipeResponseDTO['recipe'][]
}