import { StatsResponseDTO } from "../models/statsDTO"
import { statsRepository } from "../repositories/statsRepository"

export const statsService = {
  async registerCooked(userId: string, recipeId: string) {
    return statsRepository.registerCooked(userId, recipeId)
  },

  async getStats(userId: string): Promise<StatsResponseDTO> {
    const [totalFavorites, totalCooked, totalRecipesCreated, cookedRaw, favoritesRaw] =
      await Promise.all([
        statsRepository.getTotalFavorites(userId),
        statsRepository.getTotalCooked(userId),
        statsRepository.getTotalRecipesCreated(userId),
        statsRepository.getCookedByMonth(userId),
        statsRepository.getFavoritesByCategory(userId),
      ])

    const monthMap = new Map<string, number>()
    for (const { cookedAt } of cookedRaw) {
      const key = cookedAt.toISOString().slice(0, 7)
      monthMap.set(key, (monthMap.get(key) ?? 0) + 1)
    }
    const cookedByMonth = Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
    }))

    const categoryMap = new Map<string, number>()
    for (const { recipe } of favoritesRaw) {
      const cat = recipe.category
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1)
    }
    const favoritesByCategory = Array.from(categoryMap.entries()).map(
      ([category, count]) => ({ category, count })
    )

    return {
      totalFavorites,
      totalCooked,
      totalRecipesCreated,
      cookedByMonth,
      favoritesByCategory,
    }
  },
}