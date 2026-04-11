import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/color';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

const { height } = Dimensions.get('window')

interface ComingSoonScreenProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
}

export function ComingSoonScreen({ icon, title }: ComingSoonScreenProps) {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={64} color="#DDBC9B" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Em breve</Text>
        <Text style={styles.description}>
          Estamos trabalhando nessa funcionalidade.{'\n'}
          Ela estará disponível em breve!
        </Text>
      </View>

      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -height * 0.05,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(221, 188, 155, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#DDBC9B',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
})