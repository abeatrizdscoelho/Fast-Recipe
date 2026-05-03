export type MealType = 'breakfast' | 'lunch' | 'dinner'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
}

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

export const DAY_LABELS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

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