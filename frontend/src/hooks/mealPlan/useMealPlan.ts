import { ActiveFilters } from '@/src/components/FilterModal'
import { mealPlanService } from '@/src/services/mealPlanService'
import { recipeService } from '@/src/services/recipeService'
import { MEAL_TYPES, MealPlan, MealPlanEntry, MealType } from '@/src/types/mealPlan'
import { FeedRecipe } from '@/src/types/recipe'
import { formatWeekStart, getWeekStart } from '@/src/utils/formatWeekUtil'
import { useState, useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { useAppConstants } from '../useAppConstants'
import { useTranslation } from 'react-i18next'
import NetInfo from '@react-native-community/netinfo'
import { mealPlanStorage } from '@/src/storage/mealPlanStorage'
import { mealNotificationService } from '@/src/services/mealPlanNotificationService'

export function useMealPlan() {
    const today = new Date()
    const { t } = useTranslation()
    const { DAY_LABELS, MONTH_NAMES } = useAppConstants()
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(today))
    const [selectedDay, setSelectedDay] = useState<number>(() => {
        const day = today.getDay()
        return day === 0 ? 6 : day - 1
    })
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [isOffline, setIsOffline] = useState(false)
    const [selectingSlot, setSelectingSlot] = useState<{
        dayOfWeek: number; mealType: MealType; replaceEntryId?: string
    } | null>(null)
    const [recipes, setRecipes] = useState<FeedRecipe[]>([])
    const [recipeSearch, setRecipeSearch] = useState('')
    const [recipeModalVisible, setRecipeModalVisible] = useState(false)
    const [recipeFilters, setRecipeFilters] = useState<ActiveFilters>({ categories: [], dietaryRestrictions: [] })

    const weekStartStr = formatWeekStart(currentWeekStart)

    const loadPlan = useCallback(async (weekStart: string, silent = false) => {
        if (!silent) setLoading(true)
        try {
            const net = await NetInfo.fetch()
            const offline = !net.isConnected
            setIsOffline(offline)

            if (offline) {
                const local = await mealPlanStorage.getByWeek(weekStart)
                setMealPlan(local)
            } else {
                const data = await mealPlanService.getWeekPlan(weekStart)
                setMealPlan(data.mealPlan)
                await mealPlanStorage.save(data.mealPlan)
                await mealNotificationService.scheduleForWeek(data.mealPlan)
            }
        } catch (err) {
            Alert.alert(
                t('mealPlan.alerts.errorTitle'),
                err instanceof Error ? err.message : t('mealPlan.alerts.loadError')
            )
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [t])

    useEffect(() => { loadPlan(weekStartStr) }, [weekStartStr, loadPlan])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadPlan(weekStartStr, true)
    }, [weekStartStr, loadPlan])

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
        setRecipeFilters({ categories: [], dietaryRestrictions: [] })
        try {
            const data = await recipeService.getAll(1, 100)
            setRecipes(data.recipes)
        } catch { setRecipes([]) }
        setRecipeModalVisible(true)
    }

    async function handleRecipeFilter(newFilters: ActiveFilters) {
        setRecipeFilters(newFilters)
        try {
            const data = await recipeService.getAll(1, 100, recipeSearch.trim() || undefined, newFilters)
            setRecipes(data.recipes)
        } catch { setRecipes([]) }
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
            await mealPlanStorage.save(updated)
            await mealNotificationService.scheduleForWeek(updated)
        } catch (err) {
            Alert.alert(
                t('mealPlan.alerts.errorTitle'),
                err instanceof Error ? err.message : t('mealPlan.alerts.addRecipeError')
            )
        } finally { setSelectingSlot(null) }
    }

    async function handleRemoveEntry(entryId: string) {
        Alert.alert(
            t('mealPlan.alerts.removeTitle'),
            t('mealPlan.alerts.removeMessage'),
            [
                { text: t('mealPlan.alerts.cancel'), style: 'cancel' },
                { text: t('mealPlan.alerts.remove'), style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await mealPlanService.removeEntry(entryId)
                            setMealPlan(res.mealPlan)
                            await mealPlanStorage.save(res.mealPlan)
                            await mealNotificationService.scheduleForWeek(res.mealPlan)
                        } catch (err) {
                            Alert.alert(
                                t('mealPlan.alerts.errorTitle'),
                                err instanceof Error ? err.message : t('mealPlan.alerts.removeRecipeError')
                            )
                        }
                    },
                },
            ]
        )
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
        
        if (mealPlan) {                                            
            const optimistic: MealPlan = {                         
                ...mealPlan,                                       
                entries: mealPlan.entries.map(e =>                
                    e.id === entryId ? { ...e, completed: !e.completed } : e 
                ),                                                 
            }                                                      
            await mealPlanStorage.save(optimistic)                
        }                                                         
                   
        const net = await NetInfo.fetch()                           
        if (!net.isConnected) return                                

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
            await mealPlanStorage.save(res.mealPlan)
            await mealNotificationService.scheduleForWeek(res.mealPlan) 
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
            if (mealPlan) {                                      
                await mealPlanStorage.save(mealPlan)               
            }                                                    
            Alert.alert(
                t('mealPlan.alerts.errorTitle'),
                err instanceof Error ? err.message : t('mealPlan.alerts.updateRecipeError')
            )
        }
    }

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(recipeSearch.toLowerCase())
    )

    const totalEntries = mealPlan?.entries.length ?? 0

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
        isOffline,
        goToPrevWeek, goToNextWeek,
        getWeekDates, weekDates,
        getEntriesForDay, dayHasAnyEntry,
        totalEntries,
        recipeModalVisible, setRecipeModalVisible,
        recipeSearch, setRecipeSearch,
        filteredRecipes,
        openRecipeSelector, recipeFilters, handleRecipeFilter, handleSelectRecipe,
        handleRemoveEntry, handleToggleCompleted,
        dayLabel, dayIsEmpty,
    }
}