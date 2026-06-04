import { useState } from 'react'
import { Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { shoppingListService } from '@/src/services/shoppingListService'
import { ShoppingListItem } from '@/src/types/shoppingList'
import { useTranslation } from 'react-i18next'
import { useAppConstants } from '../useAppConstants'

export function useShoppingItemForm() {
    const { t } = useTranslation()
    const { INGREDIENT_CATEGORIES, INGREDIENT_UNITS } = useAppConstants()

    const params = useLocalSearchParams<{
        mode: 'add' | 'edit'
        item?: string
        categories?: string
    }>()

    const isEdit = params.mode === 'edit'
    const editItem: ShoppingListItem | null = params.item ? JSON.parse(params.item) : null
    const extraCategories: string[] = params.categories ? JSON.parse(params.categories) : []

    const [name, setName] = useState(editItem?.name ?? '')
    const [quantity, setQuantity] = useState(editItem ? String(editItem.quantity) : '')
    const [unit, setUnit] = useState(editItem?.unit ?? '')
    const [unitOpen, setUnitOpen] = useState(false)
    const [category, setCategory] = useState(editItem?.category ?? '')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({})

    const allCategories: string[] = [
        ...INGREDIENT_CATEGORIES.map(c => c.key),
        ...extraCategories.filter(
            c => c !== 'all' && !INGREDIENT_CATEGORIES.some(ic => ic.key === c)
        ),
    ]

    function validate() {
        const next: typeof errors = {}
        if (!name.trim()) next.name = t('shoppingItemForm.errorName')
        const qty = parseFloat(quantity.replace(',', '.'))
        if (isNaN(qty) || qty <= 0) next.quantity = t('shoppingItemForm.errorQuantity')
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSave() {
        if (!validate()) return
        setLoading(true)
        const qty = parseFloat(quantity.replace(',', '.'))
        try {
            if (isEdit && editItem) {
                await shoppingListService.updateItem({
                    ingredientIds: editItem.ingredientIds,
                    name: name.trim(),
                    quantity: qty,
                    unit: unit.trim(),
                    category: category.trim() || 'others',
                })
            } else {
                await shoppingListService.addItem({
                    name: name.trim(),
                    quantity: qty,
                    unit: unit.trim(),
                    category: category.trim() || 'others',
                })
            }
            router.back()
        } catch (err) {
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('shoppingItemForm.saveError'))
        } finally {
            setLoading(false)
        }
    }

    return {
        isEdit,
        name, setName,
        quantity, setQuantity,
        unit, setUnit,
        unitOpen, setUnitOpen,
        category, setCategory,
        allCategories,
        loading,
        errors,
        handleSave,
        INGREDIENT_UNITS,
    }
}