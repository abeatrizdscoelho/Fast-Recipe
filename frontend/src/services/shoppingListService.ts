import axios from 'axios'
import { api } from './api'
import { ShoppingListResponse, ToggleBoughtPayload } from '../types/shoppingList'

export const shoppingListService = {
    async getList(weekStart?: string): Promise<ShoppingListResponse> {
        try {
            const response = await api.get('/shopping-list', {
                params: weekStart ? { date: weekStart } : {},
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao buscar lista de compras')
            throw new Error('Erro inesperado')
        }
    },

    async toggleBought(payload: ToggleBoughtPayload): Promise<{ bought: boolean }> {
        try {
            const response = await api.patch('/shopping-list/bought', payload)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao atualizar item')
            throw new Error('Erro inesperado')
        }
    },
}