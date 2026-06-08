import axios from 'axios';
import { api } from './api';
import i18next from 'i18next';
import crashlytics from '@react-native-firebase/crashlytics';

export const authService = {
  async register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao registrar usuário: ${email}`)

      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('errors.registerError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (err) {
      crashlytics().setAttribute('user_email', email)
      crashlytics().log(`Erro ao tentar logar com o e-mail: ${email}`)

      if (axios.isAxiosError(err) && (err.response?.status || 0) >= 500) {
        crashlytics().recordError(err)
      }
      
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('errors.loginError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async forgotPassword(email: string, confirmEmail: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email, confirmEmail })
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao recuperar senha para: ${email}`)

      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('errors.sendEmailError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async resetPassword(token: string, password: string, confirmPassword: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
      return response.data
    } catch (err) {
      crashlytics().log(`Erro ao resetar senha para: ${password}`)

      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('errors.resetPasswordError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}