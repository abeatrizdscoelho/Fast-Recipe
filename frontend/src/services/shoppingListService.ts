import axios from 'axios'
import { api } from './api'
import {
    ShoppingListResponse,
    ToggleBoughtPayload,
    AddItemPayload,
    UpdateItemPayload,
    DeleteItemPayload,
    ShoppingListItem,
} from '../types/shoppingList'
import i18next from 'i18next'

export const shoppingListService = {
    async getList(weekStart?: string): Promise<ShoppingListResponse> {
        try {
            const response = await api.get('/shopping-list', {
                params: weekStart ? { date: weekStart } : {},
            })
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('shoppingListService.fetchError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async toggleBought(payload: ToggleBoughtPayload): Promise<{ bought: boolean }> {
        try {
            const response = await api.patch('/shopping-list/bought', payload)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('shoppingListService.toggleError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async addItem(payload: AddItemPayload): Promise<ShoppingListItem> {
        try {
            const response = await api.post('/shopping-list/items', payload)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('shoppingListService.addError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async updateItem(payload: UpdateItemPayload): Promise<ShoppingListItem> {
        try {
            const response = await api.patch('/shopping-list/items', payload)
            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('shoppingListService.updateError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },

    async deleteItem(payload: DeleteItemPayload): Promise<void> {
        try {
            await api.delete('/shopping-list/items', { data: payload })
        } catch (err) {
            if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('shoppingListService.deleteError'))
            throw new Error(i18next.t('common.unexpectedError'))
        }
    },
}