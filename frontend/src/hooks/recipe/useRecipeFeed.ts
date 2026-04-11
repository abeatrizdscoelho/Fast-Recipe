import { useState, useCallback, useRef } from 'react'
import { Alert } from 'react-native'
import { recipeService } from '../../services/recipeService'
import { FeedRecipe } from '../../types/recipe'
import { favoriteService } from '../../services/favoriteService'

let _search = ''
export const feedStore = {
    getSearch: () => _search,
    setSearch: (v: string) => { _search = v }
}

export function useFeed() {
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [recipes, setRecipes] = useState<FeedRecipe[]>([])
    const [search, setSearch] = useState(feedStore.getSearch())
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const loadingRef = useRef(false)
    const recipesRef = useRef<FeedRecipe[]>([])

    const loadFeed = useCallback(async (pageToLoad: number, isRefresh = false, searchTerm?: string): Promise<void> => {
        if (loadingRef.current) return
        loadingRef.current = true
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else if (pageToLoad === 1 && recipesRef.current.length === 0) {
                setLoading(true)
            }
            const data = await recipeService.getAll(pageToLoad, 10, searchTerm)
            const next = isRefresh || pageToLoad === 1 ? data.recipes : [...recipesRef.current, ...data.recipes]
            recipesRef.current = next
            setRecipes(next)
            setHasNextPage(data.hasNextPage)
            setPage(pageToLoad)
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar o feed.')
        } finally {
            loadingRef.current = false
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    function handleSearch(text: string) {
        setSearch(text)
        feedStore.setSearch(text)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            loadFeed(1, true, text.trim() || undefined)
        }, 500)
    }

    function loadMore() {
        if (hasNextPage && !loadingRef.current) loadFeed(page + 1, false, search.trim() || undefined)
    }

    function refresh() {
        loadFeed(1, true, search.trim() || undefined)
    }

    async function toggleFavorite(id: string) {
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r))
        try {
            await favoriteService.toggle(id)
        } catch {
            setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r))
            Alert.alert('Erro', 'Não foi possível salvar o favorito.')
        }
    }

    return { recipes, loading, refreshing, hasNextPage, search, loadFeed, loadMore, refresh, toggleFavorite, handleSearch }
}