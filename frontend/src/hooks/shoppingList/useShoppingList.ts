import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { shoppingListService } from '@/src/services/shoppingListService'
import { ShoppingList, ShoppingListItem } from '@/src/types/shoppingList'
import { consolidateShoppingList } from '@/src/utils/consolidateShoppingListUtil'
import { useTranslation } from 'react-i18next'

export function useShoppingList(weekStart?: string) {
    const { t } = useTranslation()
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
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('shoppingListScreen.loadError'))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [weekStart, t])

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
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('shoppingListScreen.toggleError'))
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
            t('shoppingListScreen.removeTitle'),
            t('shoppingListScreen.removeMessage', { name: item.name }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.remove'), style: 'destructive',
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
                            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('shoppingListScreen.removeError'))
                        }
                    },
                },
            ]
        )
    }

    const categories = ['all', ...(shoppingList?.categories ?? [])]

    const filteredItems = (shoppingList?.items ?? [])
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))

    const isEmpty = !shoppingList || shoppingList.items.length === 0
    const pendingCount = shoppingList?.items.filter(i => !i.bought).length ?? 0
    const boughtCount = shoppingList?.items.filter(i => i.bought).length ?? 0

    const grouped = filteredItems.reduce<Record<string, typeof filteredItems>>((acc, item) => {
        const cat = item.category ?? 'others'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
    }, {})

    return {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        categories,
        filteredItems,
        handleToggleBought,
        handleOpenAdd, handleOpenEdit, handleDeleteItem,
        isEmpty,
        pendingCount,
        boughtCount,
        grouped,
    }
}