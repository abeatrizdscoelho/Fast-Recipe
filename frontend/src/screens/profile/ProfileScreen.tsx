import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../../components/BottomNav';
import { Header } from '../../components/Header';
import { useProfile } from '../../hooks/profile/useProfile';
import { RecipeCard } from '../recipe/components/RecipeCard';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme()
  const { t } = useTranslation()
  const {
    user, activeTab, setActiveTab, fetching, displayed, initials, loadRecipes, toggleFavorite, handleDelete, isOffline,
  } = useProfile()

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.background },
    userCard: { backgroundColor: theme.card },
    avatar: { backgroundColor: theme.primary },
    userName: { color: theme.textPrimary },
    avatarText: { color: theme.cream },
    actionButton: { backgroundColor: theme.primary },
    actionOutline: { borderColor: theme.cream },
    actionText: { color: theme.white },
    sectionTitle: { color: theme.cream },
    tabBtnActive: { backgroundColor: theme.cream, borderColor: theme.cream },
    tabTextActive: { color: theme.primary },
    offlineText: { color: theme.cream },
  })

  useFocusEffect(
    useCallback(() => {
      loadRecipes()
    }, [loadRecipes])
  )

  return (
    <View style={[styles.container, dynStyles.container]}>
      <Header />

      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={[styles.userCard, dynStyles.userCard]}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, dynStyles.avatar]}>
                  <Text style={[styles.avatarText, dynStyles.avatarText]}>{initials}</Text>
                </View>
              )}
              <Text style={[styles.userName, dynStyles.userName]}>{user?.name ?? t('profile.fallbackName')}</Text>
              <Text style={styles.userEmail}>{user?.email ?? ''}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, dynStyles.actionButton]}
                  onPress={() => router.push('/recipe/create')}
                >
                  <Ionicons name="add-circle-outline" size={18} color={theme.white} />
                  <Text style={[styles.actionText, dynStyles.actionText]}>{t('profile.newRecipe')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionOutline, dynStyles.actionOutline]}
                  onPress={() => router.push('/profile/settings')}
                >
                  <Ionicons name="settings-outline" size={18} color={theme.cream} />
                  <Text style={[styles.actionText, { color: theme.cream }]}>{t('profile.settings')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('profile.sectionTitle')}</Text>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'minhas' && styles.tabBtnActive, activeTab === 'minhas' && dynStyles.tabBtnActive]}
                  onPress={() => setActiveTab('minhas')}
                >
                  <Text style={[styles.tabText, activeTab === 'minhas' && styles.tabTextActive, activeTab === 'minhas' && dynStyles.tabTextActive]}>
                    {t('profile.tabMine')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'favoritas' && styles.tabBtnActive, activeTab === 'favoritas' && dynStyles.tabBtnActive]}
                  onPress={() => setActiveTab('favoritas')}
                >
                  <Text style={[styles.tabText, activeTab === 'favoritas' && styles.tabTextActive, activeTab === 'favoritas' && dynStyles.tabTextActive]}>
                    {t('profile.tabFavorites')}
                  </Text>
                </TouchableOpacity>
              </View>
              {isOffline && activeTab === 'favoritas' && (
                <View style={styles.offlineBanner}>
                  <Ionicons name="cloud-offline-outline" size={14} color={theme.cream} />
                  <Text style={[styles.offlineText, dynStyles.offlineText]}>{t('profile.offlineWarning')}</Text>
                </View>
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          fetching ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(122,0,0,0.3)'} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="bookmark-outline" size={48} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(122,0,0,0.15)'} />
              <Text style={styles.emptyText}>
                {activeTab === 'minhas' ? t('profile.emptyMine') : t('profile.emptyFavorites')}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <RecipeCard
            id={item.id}
            title={item.title}
            time={item.time}
            difficulty={item.difficulty}
            description={item.description}
            photos={item.photos[0]}
            favorite={item.favorite}
            isOwner={item.authorId === user?.id}
            onFavorite={toggleFavorite}
            onEdit={(id) => router.push({ pathname: '/recipe/edit', params: { id } })}
            onDelete={handleDelete}
          />
        )}
      />
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7A0000',
  },
  listContent: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7A0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#DDBC9B',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A0000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7A0000',
    borderRadius: 50,
    paddingVertical: 10,
  },
  actionOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#DDBC9B',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#DDBC9B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabBtnActive: {
    backgroundColor: '#DDBC9B',
    borderColor: '#DDBC9B',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#7A0000',
    fontWeight: 'bold',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  offlineText: {
    color: '#DDBC9B',
    fontSize: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
})