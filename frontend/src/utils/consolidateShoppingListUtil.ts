import { ShoppingListItem } from '@/src/types/shoppingList'

type Dimension = 'mass' | 'volume' | 'unit' | 'other'

interface UnitMeta {
    canonical: string
    dimension: Dimension
    toBase: number
}

const UNIT_TABLE: Record<string, UnitMeta> = {
    'gram': { canonical: 'gram', dimension: 'mass', toBase: 1 },
    'g': { canonical: 'gram', dimension: 'mass', toBase: 1 },
    'kilogram': { canonical: 'kilogram', dimension: 'mass', toBase: 1000 },
    'kg': { canonical: 'kilogram', dimension: 'mass', toBase: 1000 },
    'milliliter': { canonical: 'milliliter', dimension: 'volume', toBase: 1 },
    'ml': { canonical: 'milliliter', dimension: 'volume', toBase: 1 },
    'liter': { canonical: 'liter', dimension: 'volume', toBase: 1000 },
    'l': { canonical: 'liter', dimension: 'volume', toBase: 1000 },
    'cup': { canonical: 'milliliter', dimension: 'volume', toBase: 240 },
    'teaspoon': { canonical: 'milliliter', dimension: 'volume', toBase: 5 },
    'tsp': { canonical: 'milliliter', dimension: 'volume', toBase: 5 },
    'tablespoon': { canonical: 'milliliter', dimension: 'volume', toBase: 15 },
    'tbsp': { canonical: 'milliliter', dimension: 'volume', toBase: 15 },
    'unit': { canonical: 'unit', dimension: 'unit', toBase: 1 },
    'un': { canonical: 'unit', dimension: 'unit', toBase: 1 },
    'grama': { canonical: 'gram', dimension: 'mass', toBase: 1 },
    'mililitro': { canonical: 'milliliter', dimension: 'volume', toBase: 1 },
    'litro': { canonical: 'liter', dimension: 'volume', toBase: 1000 },
    'unidade': { canonical: 'unit', dimension: 'unit', toBase: 1 },
}


function normalizeIngredientName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function getMeta(unit: string | null | undefined): UnitMeta {
    const key = (unit ?? '').toLowerCase().trim()
    return UNIT_TABLE[key] ?? { canonical: key || 'unit', dimension: 'other', toBase: 1 }
}

function toBaseValue(quantity: number, unit: string | null | undefined): number {
    return quantity * getMeta(unit).toBase
}

function fromBaseValue(baseValue: number, dimension: Dimension, originalCanonical: string): { quantity: number; unit: string } {
    if (dimension === 'mass') {
        if (baseValue >= 1000)
            return { quantity: parseFloat((baseValue / 1000).toFixed(2)), unit: 'kilogram' }
        return { quantity: parseFloat(baseValue.toFixed(2)), unit: 'gram' }
    }
    if (dimension === 'volume') {
        if (baseValue >= 1000)
            return { quantity: parseFloat((baseValue / 1000).toFixed(2)), unit: 'liter' }
        return { quantity: parseFloat(baseValue.toFixed(2)), unit: 'milliliter' }
    }
    return { quantity: parseFloat(baseValue.toFixed(2)), unit: originalCanonical }
}

export interface ConsolidatedItem extends ShoppingListItem {
    hasUnitConflict?: boolean
}

export function consolidateShoppingList(items: ShoppingListItem[]): ConsolidatedItem[] {
    const grouped = new Map<string, ShoppingListItem[]>()

    for (const item of items) {
        const dimension = getMeta(item.unit).dimension
        const key = `${normalizeIngredientName(item.name)}||${dimension}`
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(item)
    }

    const consolidated: ConsolidatedItem[] = []

    for (const [, group] of grouped) {
        const first = group[0]
        const meta = getMeta(first.unit)

        const totalBase = group.reduce(
            (sum, i) => sum + toBaseValue(Number(i.quantity) || 0, i.unit),
            0,
        )

        const { quantity, unit } = fromBaseValue(totalBase, meta.dimension, meta.canonical)

        consolidated.push({
            ...first,
            quantity,
            unit,
            ingredientIds: group.flatMap(i => i.ingredientIds),
            bought: group.every(i => i.bought),
        })
    }

    const nameGroups = new Map<string, ConsolidatedItem[]>()
    for (const item of consolidated) {
        const nameKey = normalizeIngredientName(item.name)
        if (!nameGroups.has(nameKey)) nameGroups.set(nameKey, [])
        nameGroups.get(nameKey)!.push(item)
    }

    for (const [, group] of nameGroups) {
        if (group.length > 1) {
            group.forEach(item => { item.hasUnitConflict = true })
        }
    }

    return consolidated
}