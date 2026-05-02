import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'

type Props = {
    rating: number
    interactive?: boolean
    size?: number
    onRate?: (r: number) => void
}

export function StarRow({ rating, interactive = false, size = 20, onRate }: Props) {
    return (
        <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                    key={star}
                    disabled={!interactive}
                    onPress={() => onRate?.(star)}
                    activeOpacity={interactive ? 0.7 : 1}
                >
                    <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={size}
                        color={star <= rating ? colors.star : colors.cream}
                    />
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    starsRow: { flexDirection: 'row', gap: 2 },
})