import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

const { height } = Dimensions.get('window')

const features = [
  { id: '1', key: 'explore', icon: require('../assets/images/icon-explore.png') },
  { id: '2', key: 'create', icon: require('../assets/images/icon-idea.png') },
  { id: '3', key: 'save', icon: require('../assets/images/icon-bookmark.png') },
]

export default function OnboardingScreen() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { t } = useTranslation()

  async function handleStart() {
    await AsyncStorage.setItem(`@fastrecipe:onboarding:${user?.id}`, 'true')
    router.replace('/(tabs)/profile')
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.welcomeText}>{t('onboarding.welcome')}</Text>
          <Text style={styles.logoText}>Fast Recipe!</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <Image
                source={feature.icon}
                style={[styles.iconImage, { tintColor: theme.cream }]}
                resizeMode="contain"
              />
              <Text style={styles.featureTitle}>
                {t(`onboarding.features.${feature.key}.title`)}
              </Text>
              <Text style={styles.featureDescription}>
                {t(`onboarding.features.${feature.key}.description`)}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.cream }]} onPress={handleStart}>
          <Text style={[styles.buttonText, { color: theme.primary }]}>{t('onboarding.startAction')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7A0000'
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.07,
    paddingBottom: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.85
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold'
  },
  featuresContainer: {
    width: '100%',
    gap: 32
  },
  featureItem: {
    alignItems: 'center',
    gap: 10
  },
  iconImage: {
    width: 85,
    height: 85,
    tintColor: '#DDBC9B'
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  featureDescription: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: height * 0.06,
    paddingTop: 16,
    width: '100%'
  },
  button: {
    backgroundColor: '#DDBC9B',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#7A0000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
})