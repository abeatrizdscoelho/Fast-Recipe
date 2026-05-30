import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch } from 'react-native'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'
import { colors } from '../../theme/color'

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  right?: React.ReactNode
  destructive?: boolean
}

function SettingItem({ icon, label, onPress, right, destructive }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !right}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, destructive && styles.iconBoxDestructive]}>
          <Ionicons
            name={icon}
            size={18}
            color={destructive ? '#e05c5c' : colors.primary}
          />
        </View>
        <Text style={[styles.itemLabel, destructive && styles.itemLabelDestructive]}>
          {label}
        </Text>
      </View>
      {right ?? (
        onPress && (
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        )
      )}
    </TouchableOpacity>
  )
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>
}

function Divider() {
  return <View style={styles.divider} />
}

export default function ProfileSettingsScreen() {
  const darkModeEnabled = false
  const currentLanguage = 'Português'

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.pageTitle}>Configurações</Text>

          <SectionTitle label="Conta" />
          <View style={styles.section}>
            <SettingItem
              icon="create-outline"
              label="Editar Perfil"
              onPress={() => router.push('/profile/edit')}
            />
          </View>

          <SectionTitle label="Receitas" />
          <View style={styles.section}>
            <SettingItem
              icon="time-outline"
              label="Histórico de Visualizações"
              onPress={() => router.push('/profile/history')}
            />
            <Divider />
            <SettingItem
              icon="bar-chart-outline"
              label="Relatório de Estatísticas"
              onPress={() => router.push('/profile/stats')}
            />
          </View>

          <SectionTitle label="Preferências" />
          <View style={styles.section}>
            <SettingItem
              icon="moon-outline"
              label="Modo Escuro"
              right={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={() => {}} 
                  trackColor={{ false: '#e0e0e0', true: colors.primary }}
                  thumbColor={colors.white}
                />
              }
            />
            <Divider />
            <SettingItem
              icon="language-outline"
              label="Idioma"
              right={
                <View style={styles.languageBadge}>
                  <Text style={styles.languageBadgeText}>{currentLanguage}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </View>
              }
              onPress={() => {}} 
            />
          </View>
        </View>
      </ScrollView>

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
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.4,
  },
  section: {
    backgroundColor: '#f7f4f1',
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDestructive: {
    backgroundColor: 'rgba(224,92,92,0.12)',
  },
  itemLabel: {
    color: colors.primary,
    fontSize: 15,
  },
  itemLabelDestructive: {
    color: '#e05c5c',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 62,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageBadgeText: {
    color: colors.primary,
    fontSize: 14,
    opacity: 0.5,
  },
})