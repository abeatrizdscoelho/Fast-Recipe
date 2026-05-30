import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { Recipe } from '../../types/recipe'
import { recentRecipesService } from '../../services/recentRecipesService'

export function useRecentRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [fetching, setFetching] = useState(true)

    const loadRecipes = useCallback(async () => {
        try {
            setFetching(true)
            const data = await recentRecipesService.getAll()
            setRecipes(data)
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar o histórico.')
        } finally {
            setFetching(false)
        }
    }, [])

    const handleClear = useCallback(() => {
        Alert.alert(
            'Limpar histórico',
            'Tem certeza que deseja limpar todo o histórico de receitas?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        await recentRecipesService.clear()
                        setRecipes([])
                    },
                },
            ]
        )
    }, [])

    return { recipes, fetching, loadRecipes, handleClear }
}