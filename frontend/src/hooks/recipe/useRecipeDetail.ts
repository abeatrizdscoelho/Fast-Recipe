import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { FeedRecipe } from '../../types/recipe'
import { recipeService } from '../../services/recipeService'
import { favoriteService } from '../../services/favoriteService'

export function useRecipeDetail(id: string) {
  const [recipe, setRecipe] = useState<FeedRecipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [togglingFavorite, setTogglingFavorite] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const data = await recipeService.getById(id)
        setRecipe(data.recipe as unknown as FeedRecipe)
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar a receita.')
        router.back()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function toggleFavorite() {
    if (!recipe || togglingFavorite) return
    setTogglingFavorite(true)
    setRecipe(prev => prev ? { ...prev, favorite: !prev.favorite } : prev)
    try {
      await favoriteService.toggle(recipe.id)
    } catch {
      setRecipe(prev => prev ? { ...prev, favorite: !prev.favorite } : prev)
      Alert.alert('Erro', 'Não foi possível salvar o favorito.')
    } finally {
      setTogglingFavorite(false)
    }
  }

    const photos = recipe?.photos ?? []
    const authorInitials = recipe?.author?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?'

  return { recipe, loading, activePhoto, setActivePhoto, toggleFavorite, photos, authorInitials }
}