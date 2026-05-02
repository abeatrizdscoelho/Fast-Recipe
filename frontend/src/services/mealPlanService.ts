import axios from 'axios'
import { api } from './api'
import { MealPlan, MealType } from '../types/mealPlan'

function dateParam(weekStart: string) {
  return { date: weekStart }
}

export const mealPlanService = {
  async getWeekPlan(date?: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.get('/meal-plan', { params: date ? { date } : {} })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao buscar planejamento')
      throw new Error('Erro inesperado')
    }
  },

  async addEntry(data: {
    recipeId: string
    dayOfWeek: number
    mealType: MealType
    weekStart: string
  }): Promise<{ mealPlan: MealPlan }> {
    try {
      const { weekStart, ...body } = data
      const response = await api.post('/meal-plan/entries', body, { params: dateParam(weekStart) })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao adicionar receita')
      throw new Error('Erro inesperado')
    }
  },

  async replaceEntry(entryId: string, recipeId: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.put(`/meal-plan/entries/${entryId}`, { recipeId })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao substituir receita')
      throw new Error('Erro inesperado')
    }
  },

  async removeEntry(entryId: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.delete(`/meal-plan/entries/${entryId}`)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao remover receita')
      throw new Error('Erro inesperado')
    }
  },
}