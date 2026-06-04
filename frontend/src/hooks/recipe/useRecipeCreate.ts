import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { RecipeFormData } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';
import { useTranslation } from 'react-i18next';

export function useCreateRecipe() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data: RecipeFormData) {
    try {
      setLoading(true)
      await recipeService.create(data)
      Alert.alert(t('common.successTitle!'), t('recipeForm.successMessage'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ])
    } catch (err) {
      Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeForm.submitError'))
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleSubmit }
}