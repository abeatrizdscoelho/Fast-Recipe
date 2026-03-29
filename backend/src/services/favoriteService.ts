import { favoriteRepository } from '../repositories/favoriteRepository'
import { recipeRepository } from '../repositories/recipeRepository'

export const favoriteService = {
    async toggle(userId: string, recipeId: string): Promise<{ favorited: boolean }> {
        const recipe = await recipeRepository.findById(recipeId)
        if (!recipe) throw new Error('Receita não encontrada')

        const existing = await favoriteRepository.find(userId, recipeId)

        if (existing) {
            await favoriteRepository.delete(userId, recipeId)
            return { favorited: false }
        } else {
            await favoriteRepository.create(userId, recipeId)
            return { favorited: true }
        }
    },

    async getFavorites(userId: string) {
        const favorites = await favoriteRepository.findFavoritedRecipes(userId)
        return {
            recipes: favorites.map(f => ({
                ...f.recipe,
                favorite: true,
                createdAt: f.recipe.createdAt.toISOString(),
            }))
        }
    },
}