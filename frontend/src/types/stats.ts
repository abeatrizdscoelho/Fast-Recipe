export type MonthStat = {
  month: string  
  count: number
}

export type CategoryStat = {
  category: string
  count: number
}

export type StatsData = {
  totalFavorites: number
  totalCooked: number
  totalRecipesCreated: number
  cookedByMonth: MonthStat[]
  favoritesByCategory: CategoryStat[]
}