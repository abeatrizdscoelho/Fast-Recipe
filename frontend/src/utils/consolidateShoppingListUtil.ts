import { ShoppingListItem } from '@/src/types/shoppingList'

type Dimension = 'mass' | 'volume' | 'unit' | 'other'

interface UnitMeta {
    canonical: string
    dimension: Dimension
    toBase: number
}

const UNIT_TABLE: Record<string, UnitMeta> = {
    'grama': { canonical: 'grama', dimension: 'mass', toBase: 1 },
    'gramas': { canonical: 'grama', dimension: 'mass', toBase: 1 },
    'g': { canonical: 'grama', dimension: 'mass', toBase: 1 },
    'quilograma': { canonical: 'quilograma', dimension: 'mass', toBase: 1000 },
    'quilogramas': { canonical: 'quilograma', dimension: 'mass', toBase: 1000 },
    'kg': { canonical: 'quilograma', dimension: 'mass', toBase: 1000 },
    'miligrama': { canonical: 'grama', dimension: 'mass', toBase: 0.001 },
    'miligramas': { canonical: 'grama', dimension: 'mass', toBase: 0.001 },
    'mg': { canonical: 'grama', dimension: 'mass', toBase: 0.001 },

    'mililitro': { canonical: 'mililitro', dimension: 'volume', toBase: 1 },
    'mililitros': { canonical: 'mililitro', dimension: 'volume', toBase: 1 },
    'ml': { canonical: 'mililitro', dimension: 'volume', toBase: 1 },
    'litro': { canonical: 'litro', dimension: 'volume', toBase: 1000 },
    'litros': { canonical: 'litro', dimension: 'volume', toBase: 1000 },
    'l': { canonical: 'litro', dimension: 'volume', toBase: 1000 },
    'xícara': { canonical: 'mililitro', dimension: 'volume', toBase: 240 },
    'xicara': { canonical: 'mililitro', dimension: 'volume', toBase: 240 },
    'xícaras': { canonical: 'mililitro', dimension: 'volume', toBase: 240 },
    'xicaras': { canonical: 'mililitro', dimension: 'volume', toBase: 240 },
    'cup': { canonical: 'mililitro', dimension: 'volume', toBase: 240 },
    'colher de sopa': { canonical: 'mililitro', dimension: 'volume', toBase: 15 },
    'colheres de sopa': { canonical: 'mililitro', dimension: 'volume', toBase: 15 },
    'tbsp': { canonical: 'mililitro', dimension: 'volume', toBase: 15 },
    'colher de chá': { canonical: 'mililitro', dimension: 'volume', toBase: 5 },
    'colheres de chá': { canonical: 'mililitro', dimension: 'volume', toBase: 5 },
    'tsp': { canonical: 'mililitro', dimension: 'volume', toBase: 5 },
    'colher': { canonical: 'mililitro', dimension: 'volume', toBase: 15 },
    'colheres': { canonical: 'mililitro', dimension: 'volume', toBase: 15 },

    'unidade': { canonical: 'unidade', dimension: 'unit', toBase: 1 },
    'unidades': { canonical: 'unidade', dimension: 'unit', toBase: 1 },
    'un': { canonical: 'unidade', dimension: 'unit', toBase: 1 },
    'und': { canonical: 'unidade', dimension: 'unit', toBase: 1 },
    'unid': { canonical: 'unidade', dimension: 'unit', toBase: 1 },
    'dente': { canonical: 'dente', dimension: 'unit', toBase: 1 },
    'dentes': { canonical: 'dente', dimension: 'unit', toBase: 1 },
    'fatia': { canonical: 'fatia', dimension: 'unit', toBase: 1 },
    'fatias': { canonical: 'fatia', dimension: 'unit', toBase: 1 },
    'pedaço': { canonical: 'pedaço', dimension: 'unit', toBase: 1 },
    'pedaços': { canonical: 'pedaço', dimension: 'unit', toBase: 1 },
    'pitada': { canonical: 'pitada', dimension: 'unit', toBase: 1 },
    'pitadas': { canonical: 'pitada', dimension: 'unit', toBase: 1 },
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
    return UNIT_TABLE[key] ?? { canonical: key || 'unidade', dimension: 'other', toBase: 1 }
}

function toBaseValue(quantity: number, unit: string | null | undefined): number {
    return quantity * getMeta(unit).toBase
}

function fromBaseValue(baseValue: number, dimension: Dimension, originalCanonical: string): 
{ quantity: number; unit: string } {
    if (dimension === 'mass') {
        if (baseValue >= 1000)
            return { quantity: parseFloat((baseValue / 1000).toFixed(2)), unit: 'quilograma' }
        return { quantity: parseFloat(baseValue.toFixed(2)), unit: 'grama' }
    }
    if (dimension === 'volume') {
        if (baseValue >= 1000)
            return { quantity: parseFloat((baseValue / 1000).toFixed(2)), unit: 'litro' }
        return { quantity: parseFloat(baseValue.toFixed(2)), unit: 'mililitro' }
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