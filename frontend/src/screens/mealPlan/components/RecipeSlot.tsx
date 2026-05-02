import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MealPlanEntry } from '@/src/types/mealPlan'
import { colors } from '@/src/theme/color'
import { router } from 'expo-router'

interface FilledSlotProps {
    entry: MealPlanEntry
    onRemove: (entryId: string) => void
    onReplace: (entryId: string) => void
}

export function FilledSlot({ entry, onRemove, onReplace }: FilledSlotProps) {
    const photo = entry.recipe.photos?.[0]
    
    return (
        <View style={styles.filledSlot}>
            <View style={styles.cardShadow}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: entry.recipe.id } })}
                    activeOpacity={0.9}
                >
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.recipeImage} />
                    ) : (
                        <View style={[styles.recipeImage, styles.noPhoto]}>
                            <Ionicons name="restaurant-outline" size={24} color="#ccc" />
                        </View>
                    )}

                    <View style={styles.timeBadge}>
                        <Ionicons name="time-outline" size={11} color={colors.white} />
                        <Text style={styles.timeText}>{entry.recipe.time}min</Text>
                    </View>

                    <View style={styles.cardFooter}>
                        <Text style={styles.recipeTitle} numberOfLines={2}>{entry.recipe.title}</Text>
                        <TouchableOpacity onPress={() => onReplace(entry.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(entry.id)}>
                <Ionicons name="close-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}

interface EmptySlotProps {
    onPress: () => void
}

export function EmptySlot({ onPress }: EmptySlotProps) {
    return (
        <TouchableOpacity style={styles.emptySlot} onPress={onPress} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={26} color="#bbb" />
            <Text style={styles.emptyText}>Adicionar{'\n'}receita</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    filledSlot: {
        width: 140, 
        position: 'relative',
    },
    cardShadow: {
        marginTop: 8, 
        marginRight: 8, 
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: '#000',
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F3F3', 
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden', 
        backgroundColor: colors.white,
    },
    recipeImage: {
        width: '100%',
        height: 85,
        backgroundColor: '#f0f0f0',
    },
    noPhoto: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    timeText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: '700',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        minHeight: 44, 
    },
    recipeTitle: {
        flex: 1, 
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        lineHeight: 16,
        paddingRight: 4,
    },
    removeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: colors.white,
        borderRadius: 12,
        zIndex: 10,
    },
    emptySlot: {
        width: 132, 
        height: 129,
        marginTop: 8, 
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#d0d0d0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        gap: 4,
    },
    emptyText: {
        fontSize: 11,
        color: '#bbb',
        textAlign: 'center',
        lineHeight: 15,
    },
})