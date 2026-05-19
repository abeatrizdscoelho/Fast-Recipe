import { useState } from 'react'
import { pantryService } from '@/src/services/pantryService'
import { PantrySuggestion } from '@/src/types/pantry'

export function usePantrySuggestions() {
    const [suggestions, setSuggestions] = useState<PantrySuggestion[]>([])
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    async function loadSuggestions() {
        setLoading(true)
        setVisible(true)
        try {
            const data = await pantryService.getSuggestions()
            setSuggestions(data.suggestions)
        } catch {
            setSuggestions([])
        } finally {
            setLoading(false)
        }
    }

    function hideSuggestions() {
        setVisible(false)
    }

    return {
        suggestions,
        loading,
        visible,
        loadSuggestions,
        hideSuggestions,
    }
}