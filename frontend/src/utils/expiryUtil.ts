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
    return new Date(expiresAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    })
}