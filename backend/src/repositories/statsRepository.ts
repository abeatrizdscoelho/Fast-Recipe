import prisma from '../database/prisma'

export const statsRepository = {
  async registerCooked(userId: string, recipeId: string) {
    return prisma.cookedRecipe.create({
      data: { userId, recipeId },
    })
  },

  async getTotalFavorites(userId: string) {
    return prisma.favorite.count({ where: { userId } })
  },

  async getTotalCooked(userId: string) {
    return prisma.cookedRecipe.count({ where: { userId } })
  },

  async getTotalRecipesCreated(userId: string) {
    return prisma.recipe.count({ where: { authorId: userId } })
  },

  async getCookedByMonth(userId: string) {
    return prisma.cookedRecipe.findMany({
      where: { userId },
      select: { cookedAt: true },
      orderBy: { cookedAt: 'asc' },
    })
  },

  async getFavoritesByCategory(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { recipe: { select: { category: true } } },
    })
  },
}