export function formatWeekRange(weekStart: string): string {
    const start = new Date(weekStart)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const format = (d: Date) =>
        d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
    return `${format(start)} – ${format(end)}`
}

export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

export function formatWeekStart(date: Date): string {
    return date.toISOString().split('T')[0]
}