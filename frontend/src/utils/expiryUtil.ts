import i18next from "i18next"

export function isExpiringSoon(expiresAt: string | null): boolean {
    if (!expiresAt) return false
    const diff = new Date(expiresAt).getTime() - Date.now()
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000 // 3 days
}

export function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false
    return new Date(expiresAt).getTime() < Date.now()
}

export function formatExpiry(expiresAt: string): string {
    const locale = i18next.language ?? 'pt-BR'
    return new Date(expiresAt).toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    })
}