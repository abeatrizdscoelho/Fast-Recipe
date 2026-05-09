import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { shoppingListService } from '@/src/services/shoppingListService'
import { ShoppingList, ShoppingListItem } from '@/src/types/shoppingList'
import { consolidateShoppingList } from '@/src/utils/consolidateShoppingListUtil'

export function useShoppingList(weekStart?: string) {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [message, setMessage] = useState<string | undefined>()
    const [search, setSearch] = useState('')

    const loadList = useCallback(async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await shoppingListService.getList(weekStart)
            const list = data.shoppingList
            if (!list) return
            const consolidatedItems = consolidateShoppingList(list.items) as ShoppingListItem[]
            setShoppingList({ ...list, items: consolidatedItems })
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
            await shoppingListService.toggleBought({ ingredientIds: item.ingredientIds, bought: !item.bought })
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

    function handleOpenAdd() {
        router.push({
            pathname: '/shoppingList/ingredient-form',
            params: {
                mode: 'add',
                categories: JSON.stringify(shoppingList?.categories ?? []),
            },
        })
    }

    function handleOpenEdit(item: ShoppingListItem) {
        router.push({
            pathname: '/shoppingList/ingredient-form',
            params: {
                mode: 'edit',
                item: JSON.stringify(item),
                categories: JSON.stringify(shoppingList?.categories ?? []),
            },
        })
    }

    function handleDeleteItem(item: ShoppingListItem) {
        Alert.alert(
            'Remover item',
            `Deseja remover "${item.name}" da lista?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', style: 'destructive',
                    onPress: async () => {
                        setShoppingList(prev => {
                            if (!prev) return prev
                            return {
                                ...prev,
                                items: prev.items.filter(i => i.ingredientIds.join() !== item.ingredientIds.join()),
                            }
                        })
                        try {
                            await shoppingListService.deleteItem({ ingredientIds: item.ingredientIds })
                        } catch (err) {
                            loadList(true)
                            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao remover item')
                        }
                    },
                },
            ]
        )
    }

    const categories = ['Todos', ...(shoppingList?.categories ?? [])]

    const filteredItems = (shoppingList?.items ?? [])
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))

    return {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        categories,
        filteredItems,
        handleToggleBought,
        handleOpenAdd, handleOpenEdit, handleDeleteItem,
    }
}