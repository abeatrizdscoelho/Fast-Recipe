import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { recipeService } from '../../services/recipeService'
import { FeedRecipe } from '../../types/recipe'
import { favoriteService } from '../../services/favoriteService'

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

    async function toggleFavorite(id: string) {
        setRecipes(prev =>
            prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
        )
        try {
            await favoriteService.toggle(id)
        } catch {
            setRecipes(prev =>
                prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
            )
            Alert.alert('Erro', 'Não foi possível salvar o favorito.')
        }
    }

    return { recipes, loading, refreshing, hasNextPage, loadFeed, loadMore, refresh, toggleFavorite }
}