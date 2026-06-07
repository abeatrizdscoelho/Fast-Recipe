import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '@/src/theme/color'
import { StarRow } from './StarRow'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
    average: number
    count: number
}

export function RatingAverage({ average, count }: Props) {
    if (count === 0) return null
    const { theme } = useTheme()
    const { t } = useTranslation()

    const dynStyles = StyleSheet.create({
        ratingAverageNumber: { color: theme.primary },
        ratingAverageCount: { color: theme.textMuted },
    })

    return (
        <View style={styles.ratingAverage}>
            <Text style={[styles.ratingAverageNumber, dynStyles.ratingAverageNumber]}>
                {average.toFixed(1)}
            </Text>
            <View style={{ gap: 2 }}>
                <StarRow rating={Math.round(average)} size={20} />
                <Text style={[styles.ratingAverageCount, dynStyles.ratingAverageCount]}>
                    {t('ratingAverage.count', { count })}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ratingAverage: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 20
    },
    ratingAverageNumber: { 
        fontSize: 36, 
        fontWeight: 'bold' },
    ratingAverageCount: { 
        fontSize: 12 
    },
})