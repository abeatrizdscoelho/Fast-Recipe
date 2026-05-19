export function formatDateInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function parseDateInputToISO(value: string): string | null {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 8) return null
    const day = parseInt(digits.slice(0, 2))
    const month = parseInt(digits.slice(2, 4)) - 1
    const year = parseInt(digits.slice(4, 8))
    const date = new Date(year, month, day)
    if (
        isNaN(date.getTime()) || 
        date.getFullYear() !== year || 
        date.getMonth() !== month || 
        date.getDate() !== day
    ) return null
    return date.toISOString()
}

export function formatISOToDateInput(iso: string | null): string {
    if (!iso) return ''
    const date = new Date(iso)
    if (isNaN(date.getTime())) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}