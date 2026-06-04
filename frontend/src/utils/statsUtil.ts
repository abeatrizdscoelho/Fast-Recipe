import i18next from "i18next"

export const MONTH_LABELS: Record<string, string> = {
    '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
    '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}

export const BAR_COLORS = ['#4A90D9', '#F5A623', '#E05C5C']

export function formatMonth(month: string): string {
    const [, mm] = month.split('-')
    const monthKeys = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december',
    ]
    const key = monthKeys[parseInt(mm) - 1]
    return key ? i18next.t(`monthNames.${key}`).slice(0, 3) : month
}