import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { darkColors, lightColors } from '../theme/color'

const THEME_KEY = '@fastrecipe:darkMode'

type ThemeColors = typeof lightColors

interface ThemeContextData {
  isDark: boolean
  theme: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(value => {
      if (value === 'true') setIsDark(true)
    })
  }, [])

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      AsyncStorage.setItem(THEME_KEY, String(next))
      return next
    })
  }

  const theme = isDark ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme deve ser usado dentro do ThemeProvider')
  return context
}