export function pluralizeUnit(quantity: number, unit: string): string {
    if (quantity <= 1) return unit

    const pluralMap: Record<string, string> = {
        'grama': 'gramas',
        'quilograma': 'quilogramas',
        'mililitro': 'mililitros',
        'litro': 'litros',
        'unidade': 'unidades',
    }

    return pluralMap[unit.toLowerCase()] ?? unit
}