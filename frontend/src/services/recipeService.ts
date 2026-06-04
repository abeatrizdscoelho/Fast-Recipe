import axios from 'axios'
import { api } from './api'
import { RecipeFormData, Recipe, FeedResponse, FeedRecipe } from '../types/recipe'
import { ActiveFilters } from '../components/FilterModal'
import i18next from 'i18next'

interface ReactNativeFile {
  uri: string
  name: string
  type: string
}

export const recipeService = {
    async create(data: RecipeFormData): Promise<{ recipe: Recipe }> {
        try {
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('time', data.time)
            formData.append('preparation', data.preparation)
            formData.append('portions', data.portions)
            formData.append('category', data.category)
            formData.append('ingredients', JSON.stringify(data.ingredients))
            formData.append('difficulty', data.difficulty)
            formData.append('description', data.description)

            if (data.dietaryRestrictions && data.dietaryRestrictions.length > 0) {
                formData.append('dietaryRestrictions', JSON.stringify(data.dietaryRestrictions))
            }

            if (data.photos && data.photos.length > 0) {
                data.photos.forEach((uri, index) => {
                    const filename = uri.split('/').pop() ?? `photo_${index}.jpg`
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    const file: ReactNativeFile = { uri, name: filename, type }
                    formData.append('photos', file as unknown as Blob)
                })
            }

            const response = await api.post('/recipes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('recipeService.createError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async getMyRecipes(): Promise<{ recipes: Recipe[] }> {
        try {
            const response = await api.get('/recipes/me')
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('recipeService.fetchError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async getAll(page: number = 1, limit: number = 10, search?: string, filters?: ActiveFilters): Promise<FeedResponse> {
        try {
            const response = await api.get('/recipes/all', {
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                    ...(filters?.categories.length ? { categories: filters.categories.join(',') } : {}),
                    ...(filters?.dietaryRestrictions.length
                        ? { dietaryRestrictions: filters.dietaryRestrictions.join(',') }
                        : {}
                    ),
                },
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('recipeService.feedError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async getById(id: string): Promise<{ recipe: FeedRecipe }> {
        try {
            const response = await api.get(`/recipes/${id}`)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('recipeService.notFoundError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async update(id: string, data: Partial<RecipeFormData>): Promise<{ recipe: Recipe }> {
        try {
            const formData = new FormData()
            if (data.title) formData.append('title', data.title)
            if (data.time) formData.append('time', data.time)
            if (data.preparation) formData.append('preparation', data.preparation)
            if (data.portions) formData.append('portions', data.portions)
            if (data.category) formData.append('category', data.category)
            if (data.ingredients) formData.append('ingredients', JSON.stringify(data.ingredients))
            if (data.difficulty) formData.append('difficulty', data.difficulty)
            if (data.description) formData.append('description', data.description)

            if (data.dietaryRestrictions) {
                formData.append('dietaryRestrictions', JSON.stringify(data.dietaryRestrictions))
            }

            if (data.photos && data.photos.length > 0) {
                data.photos.forEach((uri, index) => {
                    const filename = uri.split('/').pop() ?? `photo_${index}.jpg`
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    const file: ReactNativeFile = { uri, name: filename, type }
                    formData.append('photos', file as unknown as Blob)
                })
            }

            const response = await api.put(`/recipes/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('recipeService.updateError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/recipes/${id}`)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? i18next.t('recipeService.deleteError'))
            }
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },
}