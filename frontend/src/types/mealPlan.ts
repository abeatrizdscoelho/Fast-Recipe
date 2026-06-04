export type MealType = 'breakfast' | 'lunch' | 'dinner'

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = typeof DAY_KEYS[number]

export interface MealPlanRecipe {
  id: string
  title: string
  photos: string[]
  category: string
  time: string
}

export interface MealPlanEntry {
  id: string
  recipeId: string
  dayOfWeek: number
  mealType: MealType
  recipe: MealPlanRecipe
  completed: boolean   
}

export interface MealPlan {
  id: string
  weekStart: string
  entries: MealPlanEntry[]
}