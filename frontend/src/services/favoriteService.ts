import axios from 'axios'
import { api } from './api'
import { Recipe } from '../types/recipe'
import i18next from 'i18next'

export const favoriteService = {
    async toggle(recipeId: string): Promise<{ favorited: boolean }> {
        try {
            const response = await api.post(`/favorites/${recipeId}/toggle`)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('favoriteService.toggleError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async getFavorites(): Promise<{ recipes: Recipe[] }> {
        try {
            const response = await api.get('/favorites')
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('favoriteService.fetchError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },
}