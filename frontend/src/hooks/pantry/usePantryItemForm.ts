import { useState } from 'react'
import { Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { pantryService } from '@/src/services/pantryService'
import { PantryItem } from '@/src/types/pantry'
import { PANTRY_CATEGORIES } from '@/src/validations/pantryValidation'
import { INGREDIENT_UNITS } from '@/src/hooks/recipe/useRecipeForm'
import { formatDateInput, parseDateInputToISO, formatISOToDateInput } from '@/src/utils/dateUtil'

export function usePantryItemForm() {
    const params = useLocalSearchParams<{
        mode: 'add' | 'edit'
        item?: string
    }>()

    const isEdit = params.mode === 'edit'
    const editItem: PantryItem | null = params.item ? JSON.parse(params.item) : null

    const [name, setName] = useState(editItem?.name ?? '')
    const [quantity, setQuantity] = useState(editItem ? String(editItem.quantity) : '')
    const [unit, setUnit] = useState(editItem?.unit ?? '')
    const [unitOpen, setUnitOpen] = useState(false)
    const [category, setCategory] = useState(editItem?.category ?? 'Outros')
    const [expiresAt, setExpiresAt] = useState(formatISOToDateInput(editItem?.expiresAt ?? null))
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; quantity?: string; unit?: string; expiresAt?: string }>({})

    function handleExpiresAtChange(value: string) {
        setExpiresAt(formatDateInput(value))
    }

    function validate() {
        const next: typeof errors = {}
        if (!name.trim()) next.name = 'Informe o nome do ingrediente.'
        const qty = parseFloat(quantity.replace(',', '.'))
        if (isNaN(qty) || qty <= 0) next.quantity = 'Informe uma quantidade válida.'
        if (!unit.trim()) next.unit = 'Selecione uma unidade.'
        if (expiresAt && expiresAt.replace(/\D/g, '').length === 8) {
            const parsed = parseDateInputToISO(expiresAt)
            if (!parsed) next.expiresAt = 'Data inválida.'
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSave() {
        if (!validate()) return
        setLoading(true)
        const qty = parseFloat(quantity.replace(',', '.'))

        const isoExpiry = expiresAt ? parseDateInputToISO(expiresAt) : null

        const payload = {
            name: name.trim(),
            quantity: qty,
            unit: unit.trim(),
            category: category.trim() || 'Outros',
            expiresAt: isoExpiry,
        }

        try {
            if (isEdit && editItem) {
                await pantryService.updateItem(editItem.id, payload)
            } else {
                await pantryService.addItem(payload)
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
        expiresAt,
        handleExpiresAtChange,
        allCategories: [...PANTRY_CATEGORIES],
        allUnits: INGREDIENT_UNITS,
        loading,
        errors,
        handleSave,
    }
}