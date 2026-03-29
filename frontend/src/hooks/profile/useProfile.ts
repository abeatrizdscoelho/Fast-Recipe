import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Recipe } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';

export type Tab = 'minhas' | 'favoritas'

export function useProfile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('minhas')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [fetching, setFetching] = useState(true)

  const loadRecipes = useCallback(async () => {
    try {
      setFetching(true)
      const data = await recipeService.getMyRecipes()
      setRecipes(data.recipes)
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar suas receitas.')
    } finally {
      setFetching(false)
    }
  }, [])

  function toggleFavorite(id: string) {
    setRecipes(prev =>
      prev.map(recipe => recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe)
    )
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

  const displayed = activeTab === 'minhas' ? recipes : recipes.filter(r => r.favorite)
  
  const initials = user?.name ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()  : '?'

  return {
    user,
    activeTab,
    setActiveTab,
    recipes,
    fetching,
    displayed,
    initials,
    loadRecipes,
    toggleFavorite,
    handleDelete
  }
}