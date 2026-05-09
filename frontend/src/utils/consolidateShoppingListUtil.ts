import { ShoppingListItem } from '@/src/types/shoppingList'

// Normaliza o nome para comparação (remove acentos, lowercase, espaços extras)
function normalizeIngredientName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeUnit(unit: string | null | undefined): string {
    if (!unit) return ''
    const u = unit.toLowerCase().trim()

    const unitMap: Record<string, string> = {
        'grama': 'grama', 'gramas': 'grama',
        'quilograma': 'quilograma', 'quilogramas': 'quilograma',
        'mililitro': 'mililitro', 'mililitros': 'mililitro',
        'litro': 'litro', 'litros': 'litro',
        'unidade': 'unidade', 'unidades': 'unidade',
    }

    return unitMap[u] ?? u
}

// Converte dentro da mesma grandeza para a unidade maior quando atingir o limiar
function convertUnit(quantity: number, unit: string): { quantity: number; unit: string } {
    if (unit === 'grama' && quantity >= 1000) {
        return { quantity: parseFloat((quantity / 1000).toFixed(2)), unit: 'quilograma' }
    }
    if (unit === 'mililitro' && quantity >= 1000) {
        return { quantity: parseFloat((quantity / 1000).toFixed(2)), unit: 'litro' }
    }
    return { quantity, unit }
}

// Chave de agrupamento: mesmo ingrediente + mesma unidade normalizada
function groupKey(name: string, unit: string | null | undefined): string {
    return `${normalizeIngredientName(name)}||${normalizeUnit(unit)}`
}

export interface ConsolidatedItem extends ShoppingListItem {
    // "true" quando existem entradas do mesmo ingrediente com unidades diferentes
    hasUnitConflict?: boolean
}

export function consolidateShoppingList(items: ShoppingListItem[]): ConsolidatedItem[] {
    // Agrupa por (nome normalizado + unidade normalizada)
    const grouped = new Map<string, ShoppingListItem[]>()

    for (const item of items) {
        const key = groupKey(item.name, item.unit)
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(item)
    }

    // Soma quantidades dentro do mesmo grupo e aplica conversão de unidade
    const consolidated: ConsolidatedItem[] = []

    for (const [, group] of grouped) {
        const first = group[0]
        const rawQty = group.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
        const { quantity, unit } = convertUnit(rawQty, normalizeUnit(first.unit))

        consolidated.push({
            ...first,
            quantity,
            unit,
            ingredientIds: group.flatMap(i => i.ingredientIds),
            bought: group.every(i => i.bought),
        })
    }

    // Detecta conflitos de unidade (mesmo nome, unidades diferentes)
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