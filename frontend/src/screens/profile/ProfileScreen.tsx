import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../../components/BottomNav';
import { Header } from '../../components/Header';
import { colors } from '../../theme/color';
import { useProfile } from '../../hooks/profile/useProfile';
import { RecipeCard } from '../recipe/components/RecipeCard';

export default function ProfileScreen() {
  const {
    user, activeTab, setActiveTab, fetching, displayed, initials, loadRecipes, toggleFavorite, handleDelete
  } = useProfile()

  useFocusEffect(
    useCallback(() => {
      loadRecipes()
    }, [loadRecipes])
  )

  return (
    <View style={styles.container}>
      <Header />

      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.userCard}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email ?? ''}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/recipe/create')}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.actionText}>Nova Receita</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionOutline]}
                  onPress={() => router.push('/profile/edit')}
                >
                  <Ionicons name="create-outline" size={18} color="#DDBC9B" />
                  <Text style={[styles.actionText, { color: '#DDBC9B' }]}>Editar Perfil</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              <Text style={styles.sectionTitle}>Minhas Receitas</Text>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'minhas' && styles.tabBtnActive]}
                  onPress={() => setActiveTab('minhas')}
                >
                  <Text style={[styles.tabText, activeTab === 'minhas' && styles.tabTextActive]}>
                    Minhas receitas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'favoritas' && styles.tabBtnActive]}
                  onPress={() => setActiveTab('favoritas')}
                >
                  <Text style={[styles.tabText, activeTab === 'favoritas' && styles.tabTextActive]}>
                    Favoritas
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          fetching ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color="rgba(255,255,255,0.4)" />
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="bookmark-outline" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>
                {activeTab === 'minhas' ? 'Nenhuma receita criada ainda.' : 'Nenhuma receita favorita ainda.'}
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
    backgroundColor: colors.primary,
  },
  listContent: {
    paddingBottom: 16,
  },

  userCard: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.primary,
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
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
  },
  actionOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#DDBC9B',
  },
  actionText: {
    color: colors.white,
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
    color: colors.primary,
    fontWeight: 'bold',
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