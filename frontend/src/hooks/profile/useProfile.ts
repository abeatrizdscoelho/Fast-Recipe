import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Recipe } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';
import { favoriteService } from '../../services/favoriteService';

export type Tab = 'minhas' | 'favoritas'

export function useProfile() {
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
      Alert.alert('Erro', 'Não foi possível carregar suas receitas.')
    } finally {
      setFetching(false)
    }
  }, [])

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
      Alert.alert('Erro', 'Não foi possível salvar o favorito.')
    }
  }

  async function handleDelete(id: string) {
    Alert.alert('Excluir receita', 'Tem certeza que deseja excluir esta receita?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            await recipeService.delete(id)
            setRecipes(prev => prev.filter(r => r.id !== id))
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir a receita.')
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