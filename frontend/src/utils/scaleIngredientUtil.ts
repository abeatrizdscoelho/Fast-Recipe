const COUNTABLE_UNITS = ['unidade', 'unidades', 'xícara', 'xícaras']

export function scaleIngredient(quantity: number, scale: number, unit?: string): number {
    const scaled = quantity * scale
    if (scaled <= 0) return 0

    if (unit && COUNTABLE_UNITS.includes(unit.toLowerCase())) {
        return Math.max(1, Math.round(scaled))
    }

    if (scaled >= 10) return Math.round(scaled)
    if (scaled >= 1) return Math.round(scaled * 4) / 4
    return Math.round(scaled * 8) / 8
}