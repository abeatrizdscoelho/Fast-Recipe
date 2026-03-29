  import { useState } from 'react';
  import { Alert } from 'react-native';
  import { router } from 'expo-router';
  import { RecipeFormData } from '../../types/recipe';
  import { recipeService } from '../../services/recipeService';

  export function useCreateRecipe() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(data: RecipeFormData) {
      try {
        setLoading(true)
        await recipeService.create(data)
        Alert.alert('Sucesso!', 'Receita publicada com sucesso.', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } catch (err) {
        Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível publicar a receita.')
      } finally {
        setLoading(false)
      }
    }

    return { loading, handleSubmit }
  }