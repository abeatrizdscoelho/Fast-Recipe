import axios from 'axios'
import NetInfo from '@react-native-community/netinfo'
import { api } from './api'
import { Recipe } from '../types/recipe'
import { favoritesStorage } from '../storage/favoritesStorage'
import i18next from 'i18next'
import crashlytics from '@react-native-firebase/crashlytics'

export const favoriteService = {
    async toggle(recipeId: string): Promise<{ favorited: boolean }> {
        try {
            const response = await api.post(`/favorites/${recipeId}/toggle`)
            return response.data
        } catch (err) {
            crashlytics().log(`Erro ao alternar favorito na receita: ${recipeId}`)

            if (axios.isAxiosError(err)) {
                crashlytics().recordError(err)
                throw new Error(err.response?.data?.error ?? i18next.t('favoriteService.toggleError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async getFavorites(): Promise<{ recipes: Recipe[] }> {
        const net = await NetInfo.fetch()

        if (!net.isConnected) {
            const recipes = await favoritesStorage.getAll()
            return { recipes }
        }

        try {
            const response = await api.get('/favorites')
            const recipes: Recipe[] = response.data.recipes
            await favoritesStorage.saveMany(recipes)
            return { recipes }
        } catch (err) {
            crashlytics().log('Erro ao buscar favoritos da API')

            if (axios.isAxiosError(err)) {
                crashlytics().recordError(err)
                throw new Error(err.response?.data?.error ?? i18next.t('favoriteService.fetchError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },
}