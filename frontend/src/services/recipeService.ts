import axios from 'axios'
import { api } from './api'
import { RecipeFormData, Recipe } from '../types/recipe'

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

            if (data.photos && data.photos.length > 0) {
                data.photos.forEach((uri, index) => {
                    const filename = uri.split('/').pop() ?? `photo_${index}.jpg`
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    formData.append('photos', { uri, name: filename, type } as any)
                })
            }

            const response = await api.post('/recipes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao criar receita')
            }
            throw new Error('Erro inesperado')
        }
    },

    async getMyRecipes(): Promise<{ recipes: Recipe[] }> {
        try {
            const response = await api.get('/recipes')
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao buscar receitas')
            }
            throw new Error('Erro inesperado')
        }
    },

    async getAll(): Promise<{ recipes: Recipe[] }> {
        try {
            const response = await api.get('/recipes/all')
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao buscar receitas')
            }
            throw new Error('Erro inesperado')
        }
    },

    async getById(id: string): Promise<{ recipe: Recipe }> {
        try {
            const response = await api.get(`/recipes/${id}`)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Receita não encontrada')
            }
            throw new Error('Erro inesperado')
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

            if (data.photos && data.photos.length > 0) {
                data.photos.forEach((uri, index) => {
                    const filename = uri.split('/').pop() ?? `photo_${index}.jpg`
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    formData.append('photos', { uri, name: filename, type } as any)
                })
            }

            const response = await api.put(`/recipes/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao atualizar receita')
            }
            throw new Error('Erro inesperado')
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/recipes/${id}`)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data?.error ?? 'Erro ao excluir receita')
            }
            throw new Error('Erro inesperado')
        }
    },
}