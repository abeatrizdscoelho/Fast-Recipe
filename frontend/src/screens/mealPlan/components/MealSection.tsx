import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FilledSlot, EmptySlot } from './RecipeSlot'
import { MEAL_TYPE_LABELS, MealPlanEntry, MealType } from '@/src/types/mealPlan'
import { colors } from '@/src/theme/color'

const MEAL_ICONS: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: 'sunny-outline',
    lunch: 'partly-sunny-outline',
    dinner: 'moon-outline',
}

interface Props {
    mealType: MealType
    entries: MealPlanEntry[]
    onAdd: () => void
    onRemove: (entryId: string) => void
    onReplace: (entryId: string) => void
}

const MAX_SLOTS = 3

export function MealSection({ mealType, entries, onAdd, onRemove, onReplace }: Props) {
    const emptyCount = Math.max(0, MAX_SLOTS - entries.length)

    return (
        <View style={styles.section}>
            <View style={styles.labelCol}>
                <Ionicons name={MEAL_ICONS[mealType]} size={26} color={colors.primary} />
                <Text style={styles.mealLabel}>{MEAL_TYPE_LABELS[mealType]}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.slotsRow}
            >
                {entries.map(entry => (
                    <FilledSlot
                        key={entry.id}
                        entry={entry}
                        onRemove={onRemove}
                        onReplace={(entryId) => onReplace(entryId)}
                    />
                ))}
                {emptyCount > 0 && Array.from({ length: emptyCount }).map((_, i) => (
                    <EmptySlot key={`empty-${i}`} onPress={onAdd} />
                ))}
            </ScrollView>

            {entries.length >= 2 && (
                <View style={styles.badge}>
                    <Ionicons name="people-outline" size={13} color={colors.primary} />
                    <Text style={styles.badgeText}>{entries.length} receitas adicionadas</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    labelCol: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    mealLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.primary,
    },
    slotsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 10,
        backgroundColor: '#FFF0EC',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 50,
    },
    badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
})