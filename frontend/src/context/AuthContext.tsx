import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { authService } from '../services/authService';

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextData {
  user: User | null
  token: string | null
  loading: boolean
  signed: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Gerenciamento de sessão

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Permanecer logado
  useEffect(() => {
    // Armazenamento local
    async function loadStoredAuth() {
      const storedToken = await AsyncStorage.getItem('@fastrecipe:token')
      const storedUser = await AsyncStorage.getItem('@fastrecipe:user')
      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }
    loadStoredAuth()
  }, [])

  async function register(name: string, email: string, password: string) {
    const data = await authService.register(name, email, password)
    await AsyncStorage.setItem('@fastrecipe:token', data.token)
    await AsyncStorage.setItem('@fastrecipe:user', JSON.stringify(data.user))
    api.defaults.headers.Authorization = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
  }

  async function login(email: string, password: string) {
    const data = await authService.login(email, password)
    await AsyncStorage.setItem('@fastrecipe:token', data.token)
    await AsyncStorage.setItem('@fastrecipe:user', JSON.stringify(data.user))
    api.defaults.headers.Authorization = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
  }

  async function logout() {
    await AsyncStorage.removeItem('@fastrecipe:token')
    await AsyncStorage.removeItem('@fastrecipe:user')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signed: !!user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return context
}