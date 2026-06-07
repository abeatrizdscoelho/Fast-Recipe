import React from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useMealPlan } from '@/src/hooks/mealPlan/useMealPlan'
import { colors } from '@/src/theme/color'
import { WeekDayPicker } from './components/WeekDayPicker'
import { MealSection } from './components/MealSection'
import { RecipePickerModal } from './components/RecipePickerModal'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { MEAL_TYPES } from '@/src/types/mealPlan'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

export default function MealPlanScreen() {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const {
        loading, refreshing, onRefresh,
        selectedDay, setSelectedDay,
        goToPrevWeek, goToNextWeek,
        getEntriesForDay,
        recipeModalVisible, setRecipeModalVisible,
        recipeSearch, setRecipeSearch,
        filteredRecipes,
        openRecipeSelector, recipeFilters, handleRecipeFilter, handleSelectRecipe,
        handleRemoveEntry, handleToggleCompleted,
        dayLabel, dayIsEmpty, weekDates,
    } = useMealPlan()

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        headerTitle: { color: theme.white },
        headerSub: { color: 'rgba(255,255,255,0.75)' },
        pickerWrapper: { backgroundColor: theme.background },
        scroll: { backgroundColor: isDark ? theme.surface : '#f5f5f5' },
        loadingWrapper: { backgroundColor: isDark ? theme.surface : '#f5f5f5' },
        dayTitle: { color: theme.textMuted },
        emptyBanner: { backgroundColor: theme.card },
        emptyText: { color: theme.textPrimary },
        emptySubText: { color: theme.textMuted },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View>
                        <Text style={[styles.headerTitle, dynStyles.headerTitle]}>{t('mealPlan.screenTitle')}</Text>
                        <Text style={[styles.headerSub, dynStyles.headerSub]}>{t('mealPlan.screenSubtitle')}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.pickerWrapper, dynStyles.pickerWrapper]}>
                <WeekDayPicker
                    weekDates={weekDates}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    onPrevWeek={goToPrevWeek}
                    onNextWeek={goToNextWeek}
                />
            </View>

            {loading ? (
                <View style={[styles.loadingWrapper, dynStyles.loadingWrapper]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <ScrollView
                    style={[styles.scroll, dynStyles.scroll]}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
                >
                    <Text style={[styles.dayTitle, dynStyles.dayTitle]}>{dayLabel}</Text>

                    {dayIsEmpty && (
                        <View style={[styles.emptyBanner, dynStyles.emptyBanner]}>
                            <Ionicons name="restaurant-outline" size={36} color={theme.primary} style={{ opacity: 0.5 }} />
                            <Text style={[styles.emptyText, dynStyles.emptyText]}>{t('mealPlan.emptyDay')}</Text>
                            <Text style={[styles.emptySubText, dynStyles.emptySubText]}>{t('mealPlan.emptyDaySub')}</Text>
                        </View>
                    )}

                    {MEAL_TYPES.map(mealType => (
                        <MealSection
                            key={mealType}
                            mealType={mealType}
                            entries={getEntriesForDay(selectedDay, mealType)}
                            onAdd={() => openRecipeSelector(selectedDay, mealType)}
                            onRemove={handleRemoveEntry}
                            onReplace={(entryId) => openRecipeSelector(selectedDay, mealType, entryId)}
                            onToggleCompleted={handleToggleCompleted}
                        />
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}

            <RecipePickerModal
                visible={recipeModalVisible}
                recipes={filteredRecipes}
                search={recipeSearch}
                onSearchChange={setRecipeSearch}
                onSelect={handleSelectRecipe}
                onClose={() => setRecipeModalVisible(false)}
                filters={recipeFilters}
                onApplyFilters={handleRecipeFilter}
            />

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerSub: {
        fontSize: 12,
        marginTop: 2
    },
    pickerWrapper: {
        paddingBottom: 8
    },
    scroll: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    scrollContent: {
        padding: 16,
        paddingTop: 20
    },
    loadingWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayTitle: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 14
    },
    emptyBanner: {
        alignItems: 'center',
        borderRadius: 16,
        padding: 28,
        marginBottom: 16,
        gap: 4,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8
    },
    emptySubText: {
        fontSize: 13,
    },
})