import { shoppingListRepository } from '../repositories/shoppingListRepository'
import { mealPlanRepository } from '../repositories/mealPlanRepository'
import { getWeekStart } from '../utils/dateUtil'
import {
    ShoppingListItemDTO,
    ShoppingListResponseDTO,
} from '../models/shoppingListDTO'

export const shoppingListService = {
    async getShoppingList(userId: string, dateRef?: string): Promise<ShoppingListResponseDTO> {
        const ref = dateRef ? new Date(dateRef) : new Date()
        const weekStart = getWeekStart(ref)

        const ingredients = await shoppingListRepository.findIngredientsByWeekPlan(userId, weekStart)

        if (ingredients.length === 0) {
            return {
                shoppingList: null,
                message: 'Nenhuma receita encontrada no planejamento semanal. Adicione receitas ao planejamento para gerar sua lista de compras.',
            }
        }

        const normalize = (s: string) =>
            s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

        const consolidationMap = new Map<
            string,
            {
                ingredientIds: string[]
                name: string
                quantity: number
                unit: string
                category: string
            }
        >()

        for (const ingredient of ingredients) {
            const key = `${normalize(ingredient.name)}_${normalize(ingredient.unit)}`

            if (consolidationMap.has(key)) {
                const existing = consolidationMap.get(key)!
                existing.quantity += ingredient.quantity
                existing.ingredientIds.push(ingredient.id)
            } else {
                consolidationMap.set(key, {
                    ingredientIds: [ingredient.id],
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                    category: ingredient.category,
                })
            }
        }

        const allIngredientIds = ingredients.map(i => i.id)
        const boughtItems = await shoppingListRepository.findBoughtItems(userId, allIngredientIds)
        const boughtIds = new Set(boughtItems.map(b => b.ingredientId))

        const consolidatedItems: ShoppingListItemDTO[] = Array.from(consolidationMap.values()).map(item => ({
            ingredientIds: item.ingredientIds,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            bought: item.ingredientIds.every(id => boughtIds.has(id)),
        }))

        consolidatedItems.sort((a, b) => {
            if (a.bought !== b.bought) return a.bought ? 1 : -1
            return a.name.localeCompare(b.name, 'pt-BR')
        })

        const categories = [...new Set(consolidatedItems.map(i => i.category))].sort()

        const mealPlan = await mealPlanRepository.findByWeek(userId, weekStart)
        const totalRecipes = mealPlan
            ? new Set(mealPlan.entries.filter(e => !e.completed).map(e => e.recipeId)).size
            : 0

        return {
            shoppingList: {
                weekStart: weekStart.toISOString(),
                totalRecipes,
                items: consolidatedItems,
                categories,
            },
        }
    },

    async toggleBought(userId: string, ingredientIds: string[], bought: boolean): Promise<void> {
        await Promise.all(
            ingredientIds.map(id =>
                shoppingListRepository.upsertBoughtItem(userId, id, bought)
            )
        )
    },
}