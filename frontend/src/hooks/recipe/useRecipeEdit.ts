import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { RecipeFormData } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';
import { useTranslation } from 'react-i18next';

export function useEditRecipe(id: string) {
  const { t } = useTranslation()
  const [initialData, setInitialData] = useState<Partial<RecipeFormData> | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await recipeService.getById(id)
        setInitialData({
          title: data.recipe.title,
          time: data.recipe.time,
          ingredients: data.recipe.ingredients,
          preparation: data.recipe.preparation,
          portions: data.recipe.portions,
          category: data.recipe.category,
          dietaryRestrictions: data.recipe.dietaryRestrictions,
          difficulty: data.recipe.difficulty ?? '',
          description: data.recipe.description ?? '',
          photos: data.recipe.photos ?? [],
        })
      } catch (err) {
        Alert.alert(t('common.errorTitle'), t('recipeDetail.loadError'))
        router.replace('/(tabs)/profile')
      } finally {
        setFetching(false)
      }
    }
    loadRecipe()
  }, [id])

  async function handleSubmit(data: RecipeFormData) {
    try {
      setLoading(true)
      await recipeService.update(id, data)
      Alert.alert(t('common.successTitle'), t('recipeForm.updateSuccess'), [
        { text: t('common.ok'), onPress: () => router.replace('/(tabs)/profile') },
      ])
    } catch (err) {
      Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeForm.updateError'))
    } finally {
      setLoading(false)
    }
  }

  return { initialData, loading, fetching, handleSubmit }
}