import axios from 'axios'
import { api } from './api'
import { StatsData } from '../types/stats'

export const statsService = {
  async getStats(): Promise<StatsData> {
    try {
      const response = await api.get('/stats')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao buscar estatísticas')
      }
      throw new Error('Erro inesperado')
    }
  },

  async registerCooked(recipeId: string): Promise<void> {
    try {
      await api.post(`/stats/cooked/${recipeId}`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao registrar receita cozinhada')
      }
      throw new Error('Erro inesperado')
    }
  },
}