import axios from 'axios'
import { api } from './api'
import { StatsData } from '../types/stats'
import i18next from 'i18next'
import crashlytics from '@react-native-firebase/crashlytics'

export const statsService = {
  async getStats(): Promise<StatsData> {
    try {
      const response = await api.get('/stats')
      return response.data
    } catch (err) {
      crashlytics().log('Erro ao buscar estatísticas do usuário')

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('statsService.fetchError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async registerCooked(recipeId: string): Promise<void> {
    try {
      await api.post(`/stats/cooked/${recipeId}`)
    } catch (err) {
      crashlytics().log(`Erro ao registrar receita cozinhada ID: ${recipeId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err)
        throw new Error(err.response?.data?.error ?? i18next.t('statsService.registerCookedError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}