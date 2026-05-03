export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface MealPlanEntryDTO {
  id: string
  recipeId: string
  dayOfWeek: number
  mealType: MealType
  completed: boolean 
  recipe: {
    id: string
    title: string
    photos: string[]
    category: string
    time: string
  }
}

export interface MealPlanDTO {
  id: string
  weekStart: string
  entries: MealPlanEntryDTO[]
}

export interface MealPlanResponseDTO {
  mealPlan: MealPlanDTO
}

export interface AddMealPlanEntryDTO {
  recipeId: string
  dayOfWeek: number
  mealType: MealType
}

export interface ReplaceMealPlanEntryDTO {
  recipeId: string
}