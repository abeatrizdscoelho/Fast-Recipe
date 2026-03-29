import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/color';

type Tab = {
  icon: keyof typeof Ionicons.glyphMap
  iconActive: keyof typeof Ionicons.glyphMap
  route: string
}

const tabs: Tab[] = [
  { icon: 'home-outline', iconActive: 'home', route: '/(tabs)' },
  { icon: 'archive-outline', iconActive: 'archive', route: '/pantry' },
  { icon: 'calendar-outline', iconActive: 'calendar', route: '/calendar' },
  { icon: 'list-outline', iconActive: 'list', route: '/list' },
  { icon: 'person-outline', iconActive: 'person', route: '/profile' },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={26}
              color={isActive ? '#DDBC9B' : 'rgba(255,255,255,0.5)'}
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
    backgroundColor: colors.primary,
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