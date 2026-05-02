import React from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useMealPlan } from '@/src/hooks/mealPlan/useMealPlan'
import { DAY_LABELS, MEAL_TYPES } from '@/src/types/mealPlan'
import { colors } from '@/src/theme/color'
import { WeekDayPicker } from './components/WeekDayPicker'
import { MealSection } from './components/MealSection'
import { RecipePickerModal } from './components/RecipePickerModal'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'

export default function MealPlanScreen() {
    const {
        mealPlan, loading, refreshing, onRefresh,
        selectedDay, setSelectedDay,
        currentWeekStart, getWeekDates,
        goToPrevWeek, goToNextWeek,
        getEntriesForDay, totalEntries,
        recipeModalVisible, setRecipeModalVisible,
        recipeSearch, setRecipeSearch,
        filteredRecipes,
        openRecipeSelector, handleSelectRecipe, handleRemoveEntry,
    } = useMealPlan()

    const weekDates = getWeekDates()
    const selectedDate = weekDates[selectedDay]

    const monthNames = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
        'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
    ]
    const dayLabel = `${DAY_LABELS[selectedDay]} - ${selectedDate.getDate()} DE ${monthNames[selectedDate.getMonth()]}`

    const dayEntries = MEAL_TYPES.flatMap(mt => getEntriesForDay(selectedDay, mt))
    const dayIsEmpty = dayEntries.length === 0

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {/* <Ionicons name="restaurant-outline" size={28} color={colors.white} /> */}
                    <View>
                        <Text style={styles.headerTitle}>Planejamento</Text>
                        <Text style={styles.headerSub}>Organize suas refeições da semana!</Text>
                    </View>
                </View>
                {/* <Ionicons name="calendar-outline" size={24} color={colors.white} /> */}
            </View>

            <View style={styles.pickerWrapper}>
                <WeekDayPicker
                    weekDates={weekDates}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    onPrevWeek={goToPrevWeek}
                    onNextWeek={goToNextWeek}
                />
            </View>

            {loading ? (
                <View style={styles.loadingWrapper}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                >
                    <Text style={styles.dayTitle}>{dayLabel}</Text>

                    {dayIsEmpty && (
                        <View style={styles.emptyBanner}>
                            <Ionicons name="restaurant-outline" size={36} color={colors.primary} style={{ opacity: 0.5 }} />
                            <Text style={styles.emptyText}>Nenhuma receita adicionada.</Text>
                            <Text style={styles.emptySubText}>Planeje sua semana agora!</Text>
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
            />

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
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
        color: colors.white 
    },
    headerSub: { 
        fontSize: 12, 
        color: 'rgba(255,255,255,0.75)', 
        marginTop: 2 
    },
    pickerWrapper: { 
        backgroundColor: colors.primary, 
        paddingBottom: 8 
    },
    scroll: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
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
        backgroundColor: '#f5f5f5' 
    },
    dayTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 0.5,
        marginBottom: 14,
    },
    emptyBanner: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 28,
        marginBottom: 16,
        gap: 4,
    },
    emptyText: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#555', 
        marginTop: 8 
    },
    emptySubText: { 
        fontSize: 13, 
        color: '#aaa' 
    },
})