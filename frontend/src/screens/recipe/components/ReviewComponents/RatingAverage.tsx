import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '@/src/theme/color'
import { StarRow } from './StarRow'
import { useTranslation } from 'react-i18next'

type Props = {
    average: number
    count: number
}

export function RatingAverage({ average, count }: Props) {
    if (count === 0) return null
    const { t } = useTranslation()

    return (
        <View style={styles.ratingAverage}>
            <Text style={styles.ratingAverageNumber}>
                {average.toFixed(1)}
            </Text>
            <View style={{ gap: 2 }}>
                <StarRow rating={Math.round(average)} size={20} />
                <Text style={styles.ratingAverageCount}>
                    {t('ratingAverage.count', { count })}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ratingAverage: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20
    },
    ratingAverageNumber: { fontSize: 36, fontWeight: 'bold', color: colors.primary },
    ratingAverageCount: { fontSize: 12, color: '#aaa' },
})