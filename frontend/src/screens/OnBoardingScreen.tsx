import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { colors } from '../theme/color';

const { height } = Dimensions.get('window')

const features = [
  {
    id: '1',
    title: 'Explore Novas Receitas',
    description: 'Explore uma variedade de receitas deliciosas para preparar em casa.',
    icon: require('../assets/images/icon-explore.png'),
  },
  {
    id: '2',
    title: 'Crie e Compartilhe',
    description: 'Crie e publique suas próprias receitas e compartilhe com a comunidade.',
    icon: require('../assets/images/icon-idea.png'),
  },
  {
    id: '3',
    title: 'Salve suas Favoritas',
    description: 'Guarde suas receitas preferidas e acesse facilmente a qualquer momento.',
    icon: require('../assets/images/icon-bookmark.png'),
  },
]

export default function OnboardingScreen() {

  async function handleStart() {
    await AsyncStorage.setItem('@fastrecipe:onboarding', 'true')
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          {/* <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.welcomeText}>Bem-vindo ao</Text>
          <Text style={styles.logoText}>Fast Recipe!</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <Image
                source={feature.icon}
                style={styles.iconImage}
                resizeMode="contain"
              />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Vamos Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.85,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  featuresContainer: {
    width: '100%',
    gap: 32,
  },
  featureItem: {
    alignItems: 'center',
    gap: 10,
  },
  iconImage: {
    width: 85,
    height: 85,
    tintColor: '#DDBC9B',
  },
  featureTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureDescription: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 0.8,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: height * 0.06,
    paddingTop: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#DDBC9B',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})