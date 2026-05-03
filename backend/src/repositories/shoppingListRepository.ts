import prisma from '../database/prisma'

export const shoppingListRepository = {
    async findIngredientsByWeekPlan(userId: string, weekStart: Date) {
        const mealPlan = await prisma.mealPlan.findUnique({
            where: { userId_weekStart: { userId, weekStart } },
            include: {
                entries: {
                    where: { completed: false }, 
                    include: {
                        recipe: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        })

        if (!mealPlan) return []

        return mealPlan.entries.flatMap(entry => entry.recipe.ingredients)
    },

    async findBoughtItems(userId: string, ingredientIds: string[]) {
        return prisma.shoppingListItem.findMany({
            where: {
                userId,
                ingredientId: { in: ingredientIds },
                bought: true,
            },
            select: { ingredientId: true },
        })
    },

    async upsertBoughtItem(userId: string, ingredientId: string, bought: boolean) {
        return prisma.shoppingListItem.upsert({
            where: { userId_ingredientId: { userId, ingredientId } },
            update: { bought },
            create: { userId, ingredientId, bought },
        })
    },

    async clearBoughtItemsByRecipe(userId: string, recipeId: string) {
        const ingredients = await prisma.ingredient.findMany({
            where: { recipeId },
            select: { id: true },
        })
        const ids = ingredients.map(i => i.id)
        if (ids.length === 0) return

        await prisma.shoppingListItem.deleteMany({
            where: { userId, ingredientId: { in: ids } },
        })
    },
}