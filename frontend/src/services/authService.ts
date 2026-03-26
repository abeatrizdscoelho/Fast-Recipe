import axios from 'axios';
import { api } from './api';

export const authService = {
  async register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao cadastrar')
      }
      throw new Error('Erro inesperado')
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao fazer login')
      }
      throw new Error('Erro inesperado')
    }
  },

  async forgotPassword(email: string, confirmEmail: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email, confirmEmail })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao enviar e-mail')
      }
      throw new Error('Erro inesperado')
    }
  },

  async resetPassword(token: string, password: string, confirmPassword: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao redefinir senha')
      }
      throw new Error('Erro inesperado')
    }
  },
}