import { useState } from 'react'
import { Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { INGREDIENT_CATEGORIES } from '@/src/hooks/recipe/useRecipeForm'
import { shoppingListService } from '@/src/services/shoppingListService'
import { ShoppingListItem } from '@/src/types/shoppingList'

export function useIngredientForm() {
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
        ...INGREDIENT_CATEGORIES,
        ...extraCategories.filter(
            c => c !== 'Todos' && !(INGREDIENT_CATEGORIES as unknown as string[]).includes(c)
        ),
    ]

    function validate() {
        const next: typeof errors = {}
        if (!name.trim()) next.name = 'Informe o nome do ingrediente.'
        const qty = parseFloat(quantity.replace(',', '.'))
        if (isNaN(qty) || qty <= 0) next.quantity = 'Informe uma quantidade válida.'
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
                    category: category.trim() || 'Outros',
                })
            } else {
                await shoppingListService.addItem({
                    name: name.trim(),
                    quantity: qty,
                    unit: unit.trim(),
                    category: category.trim() || 'Outros',
                })
            }
            router.back()
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao salvar item')
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
    }
}