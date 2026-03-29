import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { RecipeFormData } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';

export function useEditRecipe(id: string) {
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
          difficulty: data.recipe.difficulty ?? '',
          description: data.recipe.description ?? '',
          photos: data.recipe.photos ?? (
            data.recipe.photoUrl ? [data.recipe.photoUrl] :
            data.recipe.photo ? [data.recipe.photo] : []
          ),
        })
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar a receita.')
        router.back()
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
      Alert.alert('Sucesso!', 'Receita atualizada com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível atualizar a receita.')
    } finally {
      setLoading(false)
    }
  }

  return { initialData, loading, fetching, handleSubmit }
}