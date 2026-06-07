import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Platform, StatusBar } from 'react-native'
import * as Notifications from 'expo-notifications'
import { AuthProvider } from '@/src/context/AuthContext'
import { ThemeProvider, useTheme } from '@/src/context/ThemeContext' 
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { initI18n } from '@/src/lang'
import { mealNotificationService } from '@/src/services/mealPlanNotificationService'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('timer', {
    name: 'Timer de receitas',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 400, 200, 400],
  })

  Notifications.setNotificationChannelAsync('meal-reminders', {
    name: 'Lembretes de refeições',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  })
}

function AppContent() {
  const { isDark } = useTheme()
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor={isDark ? '#121212' : '#7A0000'}
      />
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </>
  )
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => {
      setI18nReady(true)
      mealNotificationService.requestPermission()
    })
  }, [])

  if (!i18nReady) return null

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}