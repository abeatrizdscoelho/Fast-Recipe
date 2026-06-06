import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_BASE = process.env.EXPO_PUBLIC_API_URL_BASE

export const api = axios.create({
  baseURL: API_URL_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@fastrecipe:token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@fastrecipe:token')
      await AsyncStorage.removeItem('@fastrecipe:user')
      return Promise.reject(error)
    }

    if (config && (!error.response || error.code === 'ECONNABORTED')) {
      config.__retryCount = (config.__retryCount ?? 0) + 1
      if (config.__retryCount <= 2) {
        await new Promise(res => setTimeout(res, 1000 * config.__retryCount))
        return api(config)
      }
    }

    return Promise.reject(error)
  },
)