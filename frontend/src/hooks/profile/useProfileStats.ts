import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { StatsData } from '../../types/stats'
import { statsService } from '../../services/statsService'

export function useProfileStats() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [fetching, setFetching] = useState(true)

    const loadStats = useCallback(async () => {
        try {
            setFetching(true)
            const data = await statsService.getStats()
            setStats(data)
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar as estatísticas.')
        } finally {
            setFetching(false)
        }
    }, [])

    const maxCooked = stats ? Math.max(...stats.cookedByMonth.map(m => m.count), 1) : 1
    const maxFavorites = stats ? Math.max(...stats.favoritesByCategory.map(c => c.count), 1) : 1

    return { stats, fetching, loadStats, maxCooked, maxFavorites }
}