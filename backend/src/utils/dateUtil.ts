// Retorna a segunda-feira da semana de uma data (meia-noite UTC)
export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getUTCDay() // 0 = domingo
    const diff = day === 0 ? -6 : 1 - day
    d.setUTCDate(d.getUTCDate() + diff)
    d.setUTCHours(0, 0, 0, 0)
    return d
}