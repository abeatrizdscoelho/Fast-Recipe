import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch } from 'react-native'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/hooks/useLanguage'
import { useTheme } from '@/src/context/ThemeContext'

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  right?: React.ReactNode
  destructive?: boolean
  theme: ReturnType<typeof useTheme>['theme']
}

function SettingItem({ icon, label, onPress, right, destructive, theme }: SettingItemProps) {
  const dynStyles = StyleSheet.create({
    iconBox: { backgroundColor: theme.iconBox },
    itemLabel: { color: theme.textPrimary },
  })

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !right}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, destructive && styles.iconBoxDestructive, dynStyles.iconBox]}>
          <Ionicons
            name={icon}
            size={18}
            color={destructive ? '#e05c5c' : theme.textPrimary}
          />
        </View>
        <Text style={[styles.itemLabel, destructive && styles.itemLabelDestructive, dynStyles.itemLabel]}>
          {label}
        </Text>
      </View>
      {right ?? (
        onPress && (
          <Ionicons name="chevron-forward" size={18} color={theme.textPrimary} />
        )
      )}
    </TouchableOpacity>
  )
}

function SectionTitle({ label, theme }: { label: string, theme: ReturnType<typeof useTheme>['theme'] }) {
  return <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{label}</Text>
}

function Divider({ theme }: { theme: ReturnType<typeof useTheme>['theme'] }) {
  return <View style={[styles.divider, { backgroundColor: theme.divider }]} />
}

export default function ProfileSettingsScreen() {
  const { t } = useTranslation()
  const { isDark, toggleTheme, theme } = useTheme()
  const { currentLanguageLabel, handleLanguagePress } = useLanguage()

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    pageTitle: { color: theme.textPrimary },
    section: { backgroundColor: theme.surfaceSecondary },
    languageBadgeText: { color: theme.textPrimary },
  })

  return (
    <View style={[styles.container, dynStyles.container]}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, dynStyles.card]}>
          <Text style={[styles.pageTitle, dynStyles.pageTitle]}>{t('profileSettings.title')}</Text>

          <SectionTitle label={t('profileSettings.sectionAccount')} theme={theme} />
          <View style={[styles.section, dynStyles.section]}>
            <SettingItem
              icon="create-outline"
              label={t('profileSettings.editProfile')}
              onPress={() => router.push('/profile/edit')}
              theme={theme}
            />
          </View>

          <SectionTitle label={t('profileSettings.sectionRecipes')} theme={theme} />
          <View style={[styles.section, dynStyles.section]}>
            <SettingItem
              icon="time-outline"
              label={t('profileSettings.viewHistory')}
              onPress={() => router.push('/profile/history')}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingItem
              icon="bar-chart-outline"
              label={t('profileSettings.statsReport')}
              onPress={() => router.push('/profile/stats')}
              theme={theme}
            />
          </View>

          <SectionTitle label={t('profileSettings.sectionPreferences')} theme={theme} />
          <View style={[styles.section, dynStyles.section]}>
            <SettingItem
              icon="moon-outline"
              label={t('profileSettings.darkMode')}
              theme={theme}
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#e0e0e0', true: theme.primary }}
                  thumbColor={theme.white}
                />
              }
            />
            <Divider theme={theme} />
            <SettingItem
              icon="language-outline"
              label={t('profileSettings.language')}
              theme={theme}
              right={
                <View style={styles.languageBadge}>
                  <Text style={[styles.languageBadgeText, dynStyles.languageBadgeText]}>{currentLanguageLabel}</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.textPrimary} />
                </View>
              }
              onPress={() => handleLanguagePress()}
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
    backgroundColor: '#7A0000',
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: {
    color: '#7A0000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#7A0000',
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
    color: '#7A0000',
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
    color: '#7A0000',
    fontSize: 14,
    opacity: 0.5,
  },
})