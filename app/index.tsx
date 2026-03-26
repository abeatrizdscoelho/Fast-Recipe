import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/frontend/src/context/AuthContext';
import { colors } from '@/frontend/src/theme/color';

export default function Index() {
  const { signed, loading } = useAuth()
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkOnboarding() {
      const done = await AsyncStorage.getItem('@fastrecipe:onboarding')
      setOnboardingDone(done === 'true')
    }
    if (signed) checkOnboarding()
  }, [signed])

  if (loading || (signed && onboardingDone === null)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!signed) return <Redirect href="/(auth)/login" />
  if (!onboardingDone) return <Redirect href="/onboarding" />
  return <Redirect href="/(auth)/login" />
}