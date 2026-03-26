import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { colors } from '../theme/color';
import { Header } from '../components/Header';

// Receitas mockadas (por enquanto)
const mockRecipes = [
  {
    id: '1',
    title: 'Lasanha de Carne Moída e Queijo',
    time: '45min',
    difficulty: 'Fácil',
    description: 'Uma opção leve e saborosa para o almoço.',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
    favorite: false,
  },
  {
    id: '2',
    title: 'Frango Grelhado com Legumes',
    time: '30min',
    difficulty: 'Fácil',
    description: 'Prato leve, saudável e muito saboroso.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    favorite: true,
  },
  {
    id: '3',
    title: 'Risoto de Camarão',
    time: '60min',
    difficulty: 'Médio',
    description: 'Cremoso e cheio de sabor do mar.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    favorite: false,
  },
]

type Tab = 'minhas' | 'favoritas';

export default function ProfileScreen() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('minhas')
  const [recipes, setRecipes] = useState(mockRecipes)

  function toggleFavorite(id: string) {
    setRecipes(prev =>
      prev.map(recipe => recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe)
    )
  }

  const displayed = activeTab === 'minhas' ? recipes : recipes.filter(recipe => recipe.favorite)

  const initials = user?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?';

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
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.actionText}>Nova Receita</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionOutline]}
                  onPress={() => router.push('/edit-profile')}
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
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={48} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyText}>Nenhuma receita favorita ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.recipeMeta}>
                <Ionicons name="time-outline" size={13} color={colors.primary} />
                <Text style={styles.recipeMetaText}>{item.time}</Text>
                <Text style={styles.recipeDot}>|</Text>
                <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteRow}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={item.favorite ? 'heart' : 'heart-outline'}
                  size={14}
                  color={item.favorite ? '#e05c5c' : colors.primary}
                />
                <Text style={[styles.favoriteText, item.favorite && { color: '#e05c5c' }]}>
                  {item.favorite ? 'Favoritado' : 'Favoritar'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <TouchableOpacity style={styles.seeMoreBtn}>
                <Text style={styles.seeMoreText}>Ver mais</Text>
              </TouchableOpacity>
            </View>
          </View>
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

  recipeCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeImage: {
    width: 110,
    height: '100%',
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  recipeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    lineHeight: 18,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 11,
    color: colors.primary,
  },
  recipeDot: {
    color: '#ccc',
    fontSize: 11,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteText: {
    fontSize: 11,
    color: colors.primary,
  },
  recipeDescription: {
    fontSize: 11,
    color: '#888',
    lineHeight: 16,
  },
  seeMoreBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
  },
  seeMoreText: {
    color: colors.white,
    fontSize: 11,
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