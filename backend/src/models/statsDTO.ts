export interface StatsResponseDTO {
  totalFavorites: number
  totalCooked: number
  totalRecipesCreated: number
  cookedByMonth: MonthStatDTO[]
  favoritesByCategory: CategoryStatDTO[]
}

export interface MonthStatDTO {
  month: string  
  count: number
}

export interface CategoryStatDTO {
  category: string
  count: number
}