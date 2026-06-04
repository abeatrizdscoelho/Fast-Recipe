import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Platform, StatusBar } from 'react-native'
import * as Notifications from 'expo-notifications'
import { AuthProvider } from '@/src/context/AuthContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { initI18n } from '@/src/lang'

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('timer', {
    name: 'Timer de receitas',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 400, 200, 400],
  })
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => setI18nReady(true))
  }, [])

  if (!i18nReady) return null

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#7A0000" />
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  )
}