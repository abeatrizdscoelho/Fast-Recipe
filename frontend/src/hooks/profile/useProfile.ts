import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Recipe } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';
import { favoriteService } from '../../services/favoriteService';
import { useTranslation } from 'react-i18next';

export type Tab = 'minhas' | 'favoritas'

export function useProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('minhas')
  const [fetching, setFetching] = useState(true)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<Recipe[]>([])

  const loadRecipes = useCallback(async () => {
    try {
      setFetching(true)
      const [myData, favData] = await Promise.all([
        recipeService.getMyRecipes(),
        favoriteService.getFavorites(),
      ])
      setRecipes(myData.recipes)
      setFavorites(favData.recipes)
    } catch (err) {
      Alert.alert(t('common.errorTitle'), t('profile.loadError'))
    } finally {
      setFetching(false)
    }
  }, [t])

  async function toggleFavorite(id: string) {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
    )
    try {
      await favoriteService.toggle(id)
    } catch {
      setRecipes(prev =>
        prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
      )
      Alert.alert(t('common.errorTitle'), t('profile.favoriteError'))
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(t('profile.deleteTitle'), t('profile.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.deleteAction'), style: 'destructive',
        onPress: async () => {
          try {
            await recipeService.delete(id)
            setRecipes(prev => prev.filter(r => r.id !== id))
          } catch (err) {
            Alert.alert(t('common.errorTitle'), t('profile.deleteError'))
          }
        }
      }
    ])
  }

  const displayed = activeTab === 'minhas' ? recipes : favorites
  const initials = user?.name ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '?'

  return {
    user, activeTab, setActiveTab, recipes, fetching,
    displayed, initials, loadRecipes, toggleFavorite, favorites, handleDelete,
  }
}