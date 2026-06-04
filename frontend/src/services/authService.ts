import axios from 'axios';
import { api } from './api';
import i18next from 'i18next';

export const authService = {
  async register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('auth.errors.registerError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('auth.errors.loginError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async forgotPassword(email: string, confirmEmail: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email, confirmEmail })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('auth.errors.sendEmailError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async resetPassword(token: string, password: string, confirmPassword: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('auth.errors.resetPasswordError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}