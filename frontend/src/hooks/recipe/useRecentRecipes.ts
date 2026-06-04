import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { Recipe } from '../../types/recipe'
import { recentRecipesService } from '../../services/recentRecipesService'
import { useTranslation } from 'react-i18next'

export function useRecentRecipes() {
    const { t } = useTranslation()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [fetching, setFetching] = useState(true)

    const loadRecipes = useCallback(async () => {
        try {
            setFetching(true)
            const data = await recentRecipesService.getAll()
            setRecipes(data)
        } catch {
            Alert.alert(t('common.errorTitle'), t('profileHistory.loadError'))
        } finally {
            setFetching(false)
        }
    }, [t])

    const handleClear = useCallback(() => {
        Alert.alert(
            t('profileHistory.clearTitle'),
            t('profileHistory.clearMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('profileHistory.clear'),
                    style: 'destructive',
                    onPress: async () => {
                        await recentRecipesService.clear()
                        setRecipes([])
                    },
                },
            ]
        )
    }, [t])

    return { recipes, fetching, loadRecipes, handleClear }
}