import axios from 'axios'
import { api } from './api'
import {
  PantryListResponse,
  PantryItemResponse,
  AddPantryItemPayload,
  UpdatePantryItemPayload,
  PantrySuggestionsResponse,
} from '../types/pantry'
import i18next from 'i18next'

export const pantryService = {
  async getItems(): Promise<PantryListResponse> {
    try {
      const response = await api.get('/pantry')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('pantryService.fetchError'))
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async addItem(payload: AddPantryItemPayload): Promise<PantryItemResponse> {
    try {
      const response = await api.post('/pantry', payload)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('pantryService.addError'))
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async updateItem(id: string, payload: UpdatePantryItemPayload): Promise<PantryItemResponse> {
    try {
      const response = await api.put(`/pantry/${id}`, payload)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('pantryService.updateError'))
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      await api.delete(`/pantry/${id}`)
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('pantryService.deleteError'))
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async getSuggestions(): Promise<PantrySuggestionsResponse> {
    try {
      const response = await api.get('/pantry/suggestions')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? i18next.t('pantryService.suggestionsError'))
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}