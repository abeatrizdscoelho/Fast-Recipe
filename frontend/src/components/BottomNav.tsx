import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

type Tab = {
  icon: keyof typeof Ionicons.glyphMap
  iconActive: keyof typeof Ionicons.glyphMap
  key: string
  route: Href
  matchSegment: string
}

const tabs: Tab[] = [
  { key: 'index', icon: 'home-outline', iconActive: 'home', route: '/(tabs)', matchSegment: 'index' },
  { key: 'pantry', icon: 'archive-outline', iconActive: 'archive', route: '/pantry', matchSegment: 'pantry' },
  { key: 'planning', icon: 'calendar-outline', iconActive: 'calendar', route: '/planning', matchSegment: 'planning' },
  { key: 'list', icon: 'list-outline', iconActive: 'list', route: '/list', matchSegment: 'list' },
  { key: 'profile', icon: 'person-outline', iconActive: 'person', route: '/profile', matchSegment: 'profile' },
]

export function BottomNav() {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  function isTabActive(tab: Tab) {
    if (tab.matchSegment === 'index') {
      return pathname === '/' || pathname === '/index' || pathname.endsWith('/(tabs)')
    }
    return pathname.includes(tab.matchSegment)
  }

  const dynStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
  })

  return (
    <View style={[styles.container, dynStyles.container]}>
      {tabs.map((tab) => {
        const isActive = isTabActive(tab)
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={26}
              color={isActive ? theme.cream : 'rgba(255,255,255,0.5)'}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#7A0000',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
})