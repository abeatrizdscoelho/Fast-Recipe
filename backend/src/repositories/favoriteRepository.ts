import prisma from '../database/prisma'

export const favoriteRepository = {
    async find(userId: string, recipeId: string) {
        return prisma.favorite.findUnique({
            where: { userId_recipeId: { userId, recipeId } },
        })
    },

    async create(userId: string, recipeId: string) {
        return prisma.favorite.create({
            data: { userId, recipeId },
        })
    },

    async delete(userId: string, recipeId: string) {
        return prisma.favorite.delete({
            where: { userId_recipeId: { userId, recipeId } },
        })
    },

    async findFavoritedRecipes(userId: string) {
        return prisma.favorite.findMany({
            where: { userId },
            include: { recipe: true },
            orderBy: { createdAt: 'desc' },
        })
    },
}