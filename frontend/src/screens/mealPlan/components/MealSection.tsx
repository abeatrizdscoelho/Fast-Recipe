import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FilledSlot, EmptySlot } from './RecipeSlot'
import { MealPlanEntry, MealType } from '@/src/types/mealPlan'
import { colors } from '@/src/theme/color'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

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
    onToggleCompleted: (entryId: string) => void
}

const MAX_SLOTS = 3

export function MealSection({ mealType, entries, onAdd, onRemove, onReplace, onToggleCompleted }: Props) {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const emptyCount = Math.max(0, MAX_SLOTS - entries.length)
    const allCompleted = entries.length > 0 && entries.every(e => e.completed)

    const dynStyles = StyleSheet.create({
        section: { backgroundColor: isDark ? theme.surfaceSecondary : theme.card },
        mealLabel: { color: theme.primary },
        badgeText: { color: theme.primary },
        badge: { backgroundColor: theme.iconBox },
    })

    return (
        <View style={[styles.section, dynStyles.section]}>
            <View style={styles.labelCol}>
                <Ionicons name={MEAL_ICONS[mealType]} size={26} color={theme.primary} />
                <Text style={[styles.mealLabel, dynStyles.mealLabel]}>{t(`mealTypes.${mealType}`)}</Text>

                {entries.length > 0 && (
                    <TouchableOpacity
                        onPress={() => entries.forEach(e => onToggleCompleted(e.id))}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{ marginLeft: 'auto' }}
                    >
                        <Ionicons
                            name={allCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={22}
                            color={allCompleted ? theme.primary : theme.grayLight}
                        />
                    </TouchableOpacity>
                )}
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

            {/* {entries.length >= 2 && (
                <View style={[styles.badge, dynStyles.badge]}>
                    <Ionicons name="people-outline" size={13} color={theme.primary} />
                    <Text style={[styles.badgeText, dynStyles.badgeText]}>{entries.length} receitas adicionadas</Text>
                </View>
            )} */}
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
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 50,
    },
    badgeText: { fontSize: 12, fontWeight: '600' },
})