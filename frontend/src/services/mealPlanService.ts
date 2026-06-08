import axios from 'axios'
import { api } from './api'
import { MealPlan, MealType } from '../types/mealPlan'
import i18next from 'i18next'
import crashlytics from '@react-native-firebase/crashlytics' 

function dateParam(weekStart: string) {
  return { date: weekStart }
}

export const mealPlanService = {
  async getWeekPlan(date?: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.get('/meal-plan', { params: date ? { date } : {} })
      return response.data
    } catch (err) {
      crashlytics().log('Erro ao buscar plano de refeições')

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('mealPlanService.fetchError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
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
      crashlytics().log(`Erro ao adicionar entrada. Receita: ${data.recipeId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('mealPlanService.addError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async replaceEntry(entryId: string, recipeId: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.put(`/meal-plan/entries/${entryId}`, { recipeId })
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao substituir entrada. ID: ${entryId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('mealPlanService.replaceError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async removeEntry(entryId: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.delete(`/meal-plan/entries/${entryId}`)
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao remover entrada. ID: ${entryId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('mealPlanService.removeError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async toggleCompleted(entryId: string): Promise<{ mealPlan: MealPlan }> {
    try {
      const response = await api.patch(`/meal-plan/entries/${entryId}/completed`)
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao alternar status de conclusão. ID: ${entryId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('mealPlanService.toggleError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}