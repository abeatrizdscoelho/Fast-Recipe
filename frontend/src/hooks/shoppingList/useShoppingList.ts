import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { shoppingListService } from '@/src/services/shoppingListService'
import { ShoppingList, ShoppingListItem } from '@/src/types/shoppingList'

export function useShoppingList(weekStart?: string) {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [message, setMessage] = useState<string | undefined>()
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
    const [sortAZ, setSortAZ] = useState(true)

    const loadList = useCallback(async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await shoppingListService.getList(weekStart)
            setShoppingList(data.shoppingList)
            setMessage(data.message)
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao carregar lista de compras')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [weekStart])

    useEffect(() => { loadList() }, [loadList])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadList(true)
    }, [loadList])

    async function handleToggleBought(item: ShoppingListItem) {
        setShoppingList(prev => {
            if (!prev) return prev
            return {
                ...prev,
                items: prev.items.map(i =>
                    i.ingredientIds.join() === item.ingredientIds.join() ? { ...i, bought: !i.bought } : i
                ),
            }
        })

        try {
            await shoppingListService.toggleBought({ingredientIds: item.ingredientIds, bought: !item.bought})
        } catch (err) {
            setShoppingList(prev => {
                if (!prev) return prev
                return {
                    ...prev,
                    items: prev.items.map(i =>
                        i.ingredientIds.join() === item.ingredientIds.join() ? { ...i, bought: item.bought } : i
                    ),
                }
            })
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao atualizar item')
        }
    }

    const categories = ['Todos', ...(shoppingList?.categories ?? [])]

    const filteredItems = (shoppingList?.items ?? [])
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory
            return matchesSearch && matchesCategory
        })
        .sort((a, b) => sortAZ ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))

    const boughtCount = (shoppingList?.items ?? []).filter(i => i.bought).length
    const totalCount = shoppingList?.items.length ?? 0

    return {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        selectedCategory, setSelectedCategory,
        sortAZ, setSortAZ,
        categories,
        filteredItems,
        boughtCount,
        totalCount,
        handleToggleBought,
    }
}