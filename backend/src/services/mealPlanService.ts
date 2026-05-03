import { mealPlanRepository } from '../repositories/mealPlanRepository'
import { recipeRepository } from '../repositories/recipeRepository'
import { shoppingListRepository } from '../repositories/shoppingListRepository'
import { getWeekStart } from '../utils/dateUtil'
import {
    MealPlanDTO,
    MealPlanEntryDTO,
    MealPlanResponseDTO,
    MealType,
    AddMealPlanEntryDTO,
    ReplaceMealPlanEntryDTO,
} from '../models/mealPlanDTO'

function formatEntry(entry: {
    id: string
    dayOfWeek: number
    mealType: string
    completed: boolean
    recipe: { id: string; title: string; photos: string[]; category: string; time: string }
}): MealPlanEntryDTO {
    return {
        id: entry.id,
        recipeId: entry.recipe.id,
        dayOfWeek: entry.dayOfWeek,
        mealType: entry.mealType as MealType,
        completed: entry.completed,
        recipe: entry.recipe,
    }
}

function formatMealPlan(plan: {
    id: string
    weekStart: Date
    entries: Array<{
        id: string
        dayOfWeek: number
        mealType: string
        completed: boolean
        recipe: { id: string; title: string; photos: string[]; category: string; time: string }
    }>
}): MealPlanDTO {
    return {
        id: plan.id,
        weekStart: plan.weekStart.toISOString(),
        entries: plan.entries.map(formatEntry),
    }
}

export const mealPlanService = {
    async getWeekPlan(userId: string, dateRef?: string): Promise<MealPlanResponseDTO> {
        const ref = dateRef ? new Date(dateRef) : new Date()
        const weekStart = getWeekStart(ref)
        const plan = await mealPlanRepository.findOrCreateByWeek(userId, weekStart)
        return { mealPlan: formatMealPlan(plan) }
    },

    async addEntry(userId: string, data: AddMealPlanEntryDTO, dateRef?: string): Promise<MealPlanResponseDTO> {
        const recipe = await recipeRepository.findById(data.recipeId)
        if (!recipe) throw new Error('Receita não encontrada')

        const ref = dateRef ? new Date(dateRef) : new Date()
        const weekStart = getWeekStart(ref)

        const plan = await mealPlanRepository.findOrCreateByWeek(userId, weekStart)

        const alreadyExists = await mealPlanRepository.entryExists(
            plan.id, data.recipeId, data.dayOfWeek, data.mealType
        )
        if (alreadyExists) throw new Error('Esta receita já está neste slot do planejamento')

        await mealPlanRepository.addEntry(plan.id, data)

        const updated = await mealPlanRepository.findByWeek(userId, weekStart)
        return { mealPlan: formatMealPlan(updated!) }
    },

    async replaceEntry(
        userId: string, entryId: string, data: ReplaceMealPlanEntryDTO
    ): Promise<MealPlanResponseDTO> {
        const entry = await mealPlanRepository.findEntryById(entryId)
        if (!entry) throw new Error('Entrada não encontrada no planejamento')
        if (entry.mealPlan.userId !== userId) throw new Error('Sem permissão para editar este planejamento')

        const recipe = await recipeRepository.findById(data.recipeId)
        if (!recipe) throw new Error('Receita não encontrada')

        await shoppingListRepository.clearBoughtItemsByRecipe(userId, entry.recipeId)

        await mealPlanRepository.replaceEntry(entryId, data.recipeId)

        const weekStart = getWeekStart(entry.mealPlan.weekStart)
        const updated = await mealPlanRepository.findByWeek(userId, weekStart)
        return { mealPlan: formatMealPlan(updated!) }
    },

    async removeEntry(userId: string, entryId: string): Promise<MealPlanResponseDTO> {
        const entry = await mealPlanRepository.findEntryById(entryId)
        if (!entry) throw new Error('Entrada não encontrada no planejamento')
        if (entry.mealPlan.userId !== userId) throw new Error('Sem permissão para editar este planejamento')

        await shoppingListRepository.clearBoughtItemsByRecipe(userId, entry.recipeId)

        const weekStart = getWeekStart(entry.mealPlan.weekStart)
        await mealPlanRepository.removeEntry(entryId)

        const updated = await mealPlanRepository.findByWeek(userId, weekStart)
        return { mealPlan: formatMealPlan(updated!) }
    },

    async toggleCompleted(userId: string, entryId: string): Promise<MealPlanResponseDTO> {
        const entry = await mealPlanRepository.findEntryById(entryId)
        if (!entry) throw new Error('Entrada não encontrada no planejamento')
        if (entry.mealPlan.userId !== userId) throw new Error('Sem permissão para editar este planejamento')

        const newValue = !entry.completed 

        await mealPlanRepository.toggleCompleted(entryId, newValue)

        const weekStart = getWeekStart(entry.mealPlan.weekStart)
        const updated = await mealPlanRepository.findByWeek(userId, weekStart)
        return { mealPlan: formatMealPlan(updated!) }
    },
}