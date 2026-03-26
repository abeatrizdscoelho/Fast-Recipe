import axios from 'axios';
import { api } from './api';

export const userService = {
  async getProfile() {
    try {
      const response = await api.get('/profile')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao buscar perfil')
      }
      throw new Error('Erro inesperado')
    }
  },

  async updateProfile(data: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    avatar?: { uri: string; name: string; type: string }
  }) {
    try {
      const formData = new FormData()
      if (data.name) formData.append('name', data.name)
      if (data.email) formData.append('email', data.email)
      if (data.password) formData.append('password', data.password)
      if (data.confirmPassword) formData.append('confirmPassword', data.confirmPassword)
      if (data.avatar) {
        formData.append('avatar', {
          uri: data.avatar.uri,
          name: data.avatar.name,
          type: data.avatar.type,
        } as any)
      }

      const response = await api.put('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao atualizar perfil')
      }
      throw new Error('Erro inesperado')
    }
  },
}