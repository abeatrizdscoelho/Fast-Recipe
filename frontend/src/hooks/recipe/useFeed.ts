import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { recipeService } from '../../services/recipeService'
import { FeedRecipe } from '../../types/recipe'

export function useFeed() {
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [recipes, setRecipes] = useState<FeedRecipe[]>([])

    const loadFeed = useCallback(async (pageToLoad: number, isRefresh = false) => {
        if (loading) return
        try {
            isRefresh ? setRefreshing(true) : setLoading(true)
            const data = await recipeService.getAll(pageToLoad)
            setRecipes(prev => isRefresh ? data.recipes : [...prev, ...data.recipes])
            setHasNextPage(data.hasNextPage)
            setPage(pageToLoad)
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível carregar o feed.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [loading])

    function loadMore() {
        if (hasNextPage && !loading) {
            loadFeed(page + 1)
        }
    }

    function refresh() {
        loadFeed(1, true)
    }

    function toggleFavorite(id: string) {
        setRecipes(prev =>
            prev.map(recipe => recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe)
        )
    }

    return { recipes, loading, refreshing, hasNextPage, loadFeed, loadMore, refresh, toggleFavorite }
}