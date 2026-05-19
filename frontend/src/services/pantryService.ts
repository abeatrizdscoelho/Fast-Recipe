import axios from 'axios'
import { api } from './api'
import {
  PantryListResponse,
  PantryItemResponse,
  AddPantryItemPayload,
  UpdatePantryItemPayload,
  PantrySuggestionsResponse,
} from '../types/pantry'

export const pantryService = {
  async getItems(): Promise<PantryListResponse> {
    try {
      const response = await api.get('/pantry')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao buscar despensa')
      throw new Error('Erro inesperado')
    }
  },

  async addItem(payload: AddPantryItemPayload): Promise<PantryItemResponse> {
    try {
      const response = await api.post('/pantry', payload)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao adicionar item')
      throw new Error('Erro inesperado')
    }
  },

  async updateItem(id: string, payload: UpdatePantryItemPayload): Promise<PantryItemResponse> {
    try {
      const response = await api.put(`/pantry/${id}`, payload)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao atualizar item')
      throw new Error('Erro inesperado')
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      await api.delete(`/pantry/${id}`)
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao remover item')
      throw new Error('Erro inesperado')
    }
  },

  async getSuggestions(): Promise<PantrySuggestionsResponse> {
    try {
      const response = await api.get('/pantry/suggestions')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error ?? 'Erro ao buscar sugestões')
      throw new Error('Erro inesperado')
    }
  },
}