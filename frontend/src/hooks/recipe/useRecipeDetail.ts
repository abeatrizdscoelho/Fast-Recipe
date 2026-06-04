import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { FeedRecipe } from '@/src/types/recipe'
import { recipeService } from '@/src/services/recipeService'
import { favoriteService } from '@/src/services/favoriteService'
import { recentRecipesService } from '@/src/services/recentRecipesService'
import { statsService } from '@/src/services/statsService'
import { useAuth } from '@/src/context/AuthContext'
import { useTranslation } from 'react-i18next'

export function useRecipeDetail(id: string) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState<FeedRecipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [togglingFavorite, setTogglingFavorite] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const recipeData = await recipeService.getById(id)
        const loaded = recipeData.recipe as unknown as FeedRecipe
        setRecipe(loaded)
        recentRecipesService.add(loaded)
      } catch {
        Alert.alert(t('common.errorTitle'), t('recipeDetail.loadError'))
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
      Alert.alert(t('common.errorTitle'), t('recipeDetail.favoriteError'))
    } finally {
      setTogglingFavorite(false)
    }
  }

  const onTimerFinished = useCallback(async () => {
    if (!id) return
    try {
      await statsService.registerCooked(id)
    } catch { }
  }, [id])

  const photos = recipe?.photos ?? []
  const authorInitials = recipe?.author?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?'
  const userInitials = user?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? ''
  const userAvatarUrl = user?.avatarUrl ?? null
  const isAuthor = recipe?.authorId === user?.id

  return {
    recipe, loading, activePhoto, setActivePhoto,
    photos, authorInitials, toggleFavorite, isAuthor,
    userInitials, userAvatarUrl,
    originalPortions: Number(recipe?.portions) || 1,
    onTimerFinished,
  }
}