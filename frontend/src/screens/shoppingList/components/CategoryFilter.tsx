import React from 'react'
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors } from '@/src/theme/color'

interface Props {
    categories: string[]
    selected: string
    totalCount: number
    onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, totalCount, onSelect }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
        >
            {categories.map(cat => (
                <TouchableOpacity
                    key={cat}
                    style={[styles.chip, selected === cat && styles.chipActive]}
                    onPress={() => onSelect(cat)}
                >
                    <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>
                        {cat === 'Todos' ? `Todos (${totalCount})` : cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    row: { gap: 8, paddingBottom: 14 },
    chip: {
        paddingHorizontal: 14, 
        paddingVertical: 7,
        borderRadius: 20, 
        borderWidth: 1.5, 
        borderColor: '#ddd',
        backgroundColor: colors.white,
    },
    chipActive: { 
        backgroundColor: colors.primary, 
        borderColor: colors.primary 
    },
    chipText: { 
        fontSize: 13, 
        color: '#666', 
        fontWeight: '500' 
    },
    chipTextActive: { 
        color: colors.white, 
        fontWeight: '700' 
    },
})