import prisma from '../database/prisma'
import { AddItemDTO, UpdateItemDTO } from '../models/shoppingListDTO'

export const shoppingListRepository = {
    async findIngredientsByWeekPlan(userId: string, weekStart: Date) {
        const mealPlan = await prisma.mealPlan.findUnique({
            where: { userId_weekStart: { userId, weekStart } },
            include: {
                entries: {
                    where: { completed: false },
                    include: {
                        recipe: {
                            include: { ingredients: true },
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

    async findManualItems(userId: string) {
        return prisma.manualShoppingItem.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        })
    },

    async createManualItem(userId: string, data: AddItemDTO) {
        return prisma.manualShoppingItem.create({
            data: { userId, ...data },
        })
    },

    async updateManualItem(id: string, userId: string, data: Omit<UpdateItemDTO, 'ingredientIds'>) {
        return prisma.manualShoppingItem.update({
            where: { id, userId },
            data,
        })
    },

    async toggleManualItemBought(id: string, userId: string, bought: boolean) {
        return prisma.manualShoppingItem.update({
            where: { id, userId },
            data: { bought },
        })
    },

    async deleteManualItem(id: string, userId: string) {
        return prisma.manualShoppingItem.delete({
            where: { id, userId },
        })
    },
}