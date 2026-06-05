import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { pantryService } from '@/src/services/pantryService'
import { PantryItem } from '@/src/types/pantry'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import NetInfo from '@react-native-community/netinfo'         
import { pantryStorage } from '@/src/storage/pantryStorage'  

export function usePantry() {
    const { t } = useTranslation()
    const [items, setItems] = useState<PantryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [isOffline, setIsOffline] = useState(false)         
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const loadItems = useCallback(async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const net = await NetInfo.fetch()                 
            const offline = !net.isConnected                  
            setIsOffline(offline)                             

            if (offline) {                                    
                const local = await pantryStorage.getAll()   
                setItems(local)                               
            } else {
                const data = await pantryService.getItems()
                setItems(data.items)
                await pantryStorage.save(data.items)          
            }
        } catch (err) {
            Alert.alert(t('pantry.alerts.errorTitle'), err instanceof Error ? err.message : t('pantry.alerts.loadError'))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [t])

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
            t('pantry.alerts.removeTitle'),
            t('pantry.alerts.removeMessage', { name: item.name }),
            [
                { text: t('pantry.alerts.cancel'), style: 'cancel' },
                { text: t('pantry.alerts.remove'), style: 'destructive',
                    onPress: async () => {
                        setItems(prev => prev.filter(i => i.id !== item.id))
                        try {
                            await pantryService.deleteItem(item.id)
                            await pantryStorage.remove(item.id)  
                        } catch (err) {
                            loadItems(true)
                            Alert.alert(t('pantry.alerts.errorTitle'), err instanceof Error ? err.message : t('pantry.alerts.removeError'))
                        }
                    },
                },
            ]
        )
    }

    const rawCategories = ['all', ...Array.from(new Set(items.map(i => i.category))).sort()]

    const categories = rawCategories.map(cat => ({
        key: cat,
        label: cat === 'all' ? t('pantry.categories.all') : t(`ingredientCategories.${cat}`),
    }))

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
        acc[cat.key] = cat.key === 'all'
            ? items.length
            : items.filter(i => i.category === cat.key).length
        return acc
    }, {})

    const isEmpty = items.length === 0

    return {
        items,
        loading,
        refreshing,
        onRefresh,
        isOffline,                                          
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