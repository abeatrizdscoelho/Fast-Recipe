import React from 'react'
import { View, Text, StyleSheet, DimensionValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    pending: number
    bought: number
}

export function SummaryBanner({ pending, bought }: Props) {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const total = pending + bought
    const progress = total > 0 ? bought / total : 0
    const percentValue = Math.round(progress * 100)

    const dynStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.card,
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: isDark ? 12 : 8,
            elevation: isDark ? 6 : 3,
        },
        iconBox: { backgroundColor: isDark ? theme.iconBox : '#FFF0EC' },
        iconBoxDone: { backgroundColor: isDark ? 'rgba(76,175,80,0.12)' : '#E8F5E9' },
        divider: { backgroundColor: theme.divider },
        count: { color: isDark ? theme.textPrimary : '#222' },
        progressTrack: { backgroundColor: isDark ? theme.surfaceSecondary : '#f0f0f0' },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <View style={styles.counters}>
                <View style={styles.side}>
                    <View style={[styles.iconBox, dynStyles.iconBox]}>
                        <Ionicons name="cart-outline" size={20} color={theme.primary} />
                    </View>
                    <Text style={[styles.count, dynStyles.count]}>{pending}</Text>
                    <Text style={styles.label}>{t('shoppingList.pending')}</Text>
                </View>

                <View style={[styles.divider, dynStyles.divider]} />

                <View style={styles.side}>
                    <View style={[styles.iconBox, dynStyles.iconBoxDone]}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                    </View>
                    <Text style={[styles.count, dynStyles.count, bought > 0 && styles.countDone]}>{bought}</Text>
                    <Text style={styles.label}>{t('shoppingList.bought')}</Text>
                </View>
            </View>

            {total > 0 && (
                <View style={styles.progressWrapper}>
                    <View style={[styles.progressTrack, dynStyles.progressTrack]}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` as DimensionValue }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                        {t('shoppingList.completedPercent', { percent: percentValue })}
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 12,
        shadowOffset: { width: 0, height: 2 },
    },
    counters: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    side: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    divider: {
        width: 1,
        height: 50,
        marginHorizontal: 8,
    },
    count: {
        fontSize: 22,
        fontWeight: '800',
    },
    countDone: {
        color: '#4CAF50',
    },
    label: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    progressWrapper: {
        gap: 6,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    progressLabel: {
        fontSize: 11,
        color: '#aaa',
        textAlign: 'right',
        fontWeight: '500',
    },
})