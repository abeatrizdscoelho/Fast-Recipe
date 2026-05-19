import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { pantryService } from '@/src/services/pantryService'
import { PantryItem } from '@/src/types/pantry'
import { router } from 'expo-router'

export function usePantry() {
    const [items, setItems] = useState<PantryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')

    const loadItems = useCallback(async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await pantryService.getItems()
            setItems(data.items)
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao carregar despensa')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => { loadItems() }, [loadItems])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadItems(true)
    }, [loadItems])

    function handleOpenAdd() {
        router.push({ pathname: '/pantry/item-form', params: { mode: 'add' } })
    }

    function handleOpenEdit(item: PantryItem) {
        router.push({
            pathname: '/pantry/item-form',
            params: { mode: 'edit', item: JSON.stringify(item) },
        })
    }

    function handleDeleteItem(item: PantryItem) {
        Alert.alert(
            'Remover item',
            `Deseja remover "${item.name}" da despensa?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', style: 'destructive',
                    onPress: async () => {
                        setItems(prev => prev.filter(i => i.id !== item.id))
                        try {
                            await pantryService.deleteItem(item.id)
                        } catch (err) {
                            loadItems(true)
                            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao remover item')
                        }
                    },
                },
            ]
        )
    }

    const categories = ['Todos', ...Array.from(new Set(items.map(i => i.category))).sort()]

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
        acc[cat] = cat === 'Todos'
            ? items.length
            : items.filter(i => i.category === cat).length
        return acc
    }, {})

    const isEmpty = items.length === 0

    return {
        items,
        loading,
        refreshing,
        onRefresh,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        categories,
        categoryCounts,
        filteredItems,
        handleOpenAdd,
        handleOpenEdit,
        handleDeleteItem,
        loadItems,
        isEmpty,
    }
}