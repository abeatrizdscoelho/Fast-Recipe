import i18next from 'i18next'

export function pluralizeUnit(quantity: number, unit: string): string {
    return i18next.t(`ingredientUnits.${unit}`, { count: quantity, defaultValue: unit })
}