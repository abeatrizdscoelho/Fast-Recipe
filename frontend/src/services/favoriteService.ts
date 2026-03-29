import axios from 'axios'
import { api } from './api'
import { Recipe } from '../types/recipe'

export const favoriteService = {
    async toggle(recipeId: string): Promise<{ favorited: boolean }> {
        try {
            const response = await api.post(`/favorites/${recipeId}/toggle`)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao favoritar receita')
            }
            throw new Error('Erro inesperado')
        }
    },

    async getFavorites(): Promise<{ recipes: Recipe[] }> {
        try {
            const response = await api.get('/favorites')
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao buscar favoritos')
            }
            throw new Error('Erro inesperado')
        }
    },
}