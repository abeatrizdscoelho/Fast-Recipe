import { mealPlanService } from '@/src/services/mealPlanService'
import { recipeService } from '@/src/services/recipeService'
import { DAY_LABELS, MEAL_TYPES, MealPlan, MealPlanEntry, MealType } from '@/src/types/mealPlan'
import { FeedRecipe } from '@/src/types/recipe'
import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'

function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function formatWeekStart(date: Date): string {
    return date.toISOString().split('T')[0]
}

export function useMealPlan() {
    const today = new Date()
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(today))
    const [selectedDay, setSelectedDay] = useState<number>(() => {
        const day = today.getDay()
        return day === 0 ? 6 : day - 1
    })
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectingSlot, setSelectingSlot] = useState<{
        dayOfWeek: number; mealType: MealType; replaceEntryId?: string
    } | null>(null)
    const [recipes, setRecipes] = useState<FeedRecipe[]>([])
    const [recipeSearch, setRecipeSearch] = useState('')
    const [recipeModalVisible, setRecipeModalVisible] = useState(false)

    const weekStartStr = formatWeekStart(currentWeekStart)

    const loadPlan = useCallback(async (weekStart: string, silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await mealPlanService.getWeekPlan(weekStart)
            setMealPlan(data.mealPlan)
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao carregar planejamento')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => { loadPlan(weekStartStr) }, [weekStartStr])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadPlan(weekStartStr, true)
    }, [weekStartStr])

    function goToPrevWeek() {
        setCurrentWeekStart(prev => {
            const d = new Date(prev); d.setDate(d.getDate() - 7); return d
        })
        setSelectedDay(0)
    }

    function goToNextWeek() {
        setCurrentWeekStart(prev => {
            const d = new Date(prev); d.setDate(d.getDate() + 7); return d
        })
        setSelectedDay(0)
    }

    function getWeekDates(): Date[] {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(currentWeekStart); d.setDate(d.getDate() + i); return d
        })
    }

    function getEntriesForDay(dayOfWeek: number, mealType: MealType): MealPlanEntry[] {
        if (!mealPlan) return []
        return mealPlan.entries.filter(e => e.dayOfWeek === dayOfWeek && e.mealType === mealType)
    }

    function dayHasAnyEntry(dayOfWeek: number): boolean {
        if (!mealPlan) return false
        return mealPlan.entries.some(e => e.dayOfWeek === dayOfWeek)
    }

    async function openRecipeSelector(dayOfWeek: number, mealType: MealType, replaceEntryId?: string) {
        setSelectingSlot({ dayOfWeek, mealType, replaceEntryId })
        setRecipeSearch('')
        try {
            const data = await recipeService.getAll(1, 100)
            setRecipes(data.recipes)
        } catch { setRecipes([]) }
        setRecipeModalVisible(true)
    }

    async function handleSelectRecipe(recipeId: string) {
        if (!selectingSlot) return
        setRecipeModalVisible(false)
        try {
            let updated: MealPlan
            if (selectingSlot.replaceEntryId) {
                const res = await mealPlanService.replaceEntry(selectingSlot.replaceEntryId, recipeId)
                updated = res.mealPlan
            } else {
                const res = await mealPlanService.addEntry({
                    recipeId,
                    dayOfWeek: selectingSlot.dayOfWeek,
                    mealType: selectingSlot.mealType,
                    weekStart: weekStartStr,
                })
                updated = res.mealPlan
            }
            setMealPlan(updated)
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao adicionar receita')
        } finally { setSelectingSlot(null) }
    }

    async function handleRemoveEntry(entryId: string) {
        Alert.alert('Remover receita', 'Deseja remover esta receita do planejamento?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive',
                onPress: async () => {
                    try {
                        const res = await mealPlanService.removeEntry(entryId)
                        setMealPlan(res.mealPlan)
                    } catch (err) {
                        Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao remover receita')
                    }
                },
            },
        ])
    }

    async function handleToggleCompleted(entryId: string) {
        setMealPlan(prev => {
            if (!prev) return prev
            return {
                ...prev,
                entries: prev.entries.map(e =>
                    e.id === entryId ? { ...e, completed: !e.completed } : e
                ),
            }
        })
        try {
            const res = await mealPlanService.toggleCompleted(entryId)
            setMealPlan(prev => {
                if (!prev) return prev
                return {
                    ...prev,
                    entries: prev.entries.map(e =>
                        e.id === entryId
                            ? { ...e, completed: res.mealPlan.entries.find(r => r.id === entryId)?.completed ?? e.completed }
                            : e
                    ),
                }
            })
        } catch (err) {
            setMealPlan(prev => {
                if (!prev) return prev
                return {
                    ...prev,
                    entries: prev.entries.map(e =>
                        e.id === entryId ? { ...e, completed: !e.completed } : e
                    ),
                }
            })
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao atualizar receita')
        }
    }

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(recipeSearch.toLowerCase())
    )

    const totalEntries = mealPlan?.entries.length ?? 0

    const MONTH_NAMES = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
        'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
    ]

    const weekDates = getWeekDates()
    const selectedDate = weekDates[selectedDay]
    const dayLabel = `${DAY_LABELS[selectedDay]} - ${selectedDate.getDate()} DE ${MONTH_NAMES[selectedDate.getMonth()]}`
    const dayEntries = MEAL_TYPES.flatMap(mt => getEntriesForDay(selectedDay, mt))
    const dayIsEmpty = dayEntries.length === 0

    return {
        mealPlan,
        loading, refreshing, onRefresh,
        selectedDay, setSelectedDay,
        currentWeekStart, weekStartStr,
        goToPrevWeek, goToNextWeek,
        getWeekDates, weekDates,
        getEntriesForDay, dayHasAnyEntry,
        totalEntries,
        recipeModalVisible, setRecipeModalVisible,
        recipeSearch, setRecipeSearch,
        filteredRecipes,
        openRecipeSelector, handleSelectRecipe,
        handleRemoveEntry, handleToggleCompleted,
        dayLabel, dayIsEmpty,
    }
}