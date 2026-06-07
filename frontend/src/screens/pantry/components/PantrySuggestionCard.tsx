import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { PantrySuggestion } from '@/src/types/pantry'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    item: PantrySuggestion
}

export function PantrySuggestionCard({ item }: Props) {
    const photo = item.photos?.[0]
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()

    const dynStyles = StyleSheet.create({
        card: { backgroundColor: theme.card },
        imageFallback: { backgroundColor: theme.surfaceSecondary },
        title: { color: theme.primary },
        metaText: { color: theme.textMuted },
        metaDot: { color: theme.grayLight },
        matchBadge: { backgroundColor: isDark ? theme.iconBox : '#FFF0EC' },
        matchText: { color: theme.primary },
    })

    return (
        <TouchableOpacity
            style={[styles.card, dynStyles.card]}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })}
        >
            {photo ? (
                <Image source={{ uri: photo }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.imageFallback, dynStyles.imageFallback]}>
                    <Ionicons name="restaurant-outline" size={28} color={theme.grayLight} />
                </View>
            )}

            <View style={styles.info}>
                <Text style={[styles.title, dynStyles.title]} numberOfLines={2}>{item.title}</Text>

                <View style={styles.meta}>
                    <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                    <Text style={[styles.metaText, dynStyles.metaText]}>{item.time}min</Text>
                    {item.difficulty && (
                        <>
                            <Text style={[styles.metaDot, dynStyles.metaDot]}>·</Text>
                            <Text style={[styles.metaText, dynStyles.metaText]}>{t(`difficulties.${item.difficulty}`, item.difficulty)}</Text>
                        </>
                    )}
                </View>

                <View style={[styles.matchBadge, dynStyles.matchBadge]}>
                    <Ionicons name="checkmark-circle" size={12} color={theme.primary} />
                    <Text style={[styles.matchText, dynStyles.matchText]}>
                        {t('pantrySuggestion.match', { count: item.matchCount, percentage: item.matchPercentage })}
                    </Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color={theme.grayLight} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 10,
    },
    imageFallback: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
    },
    metaDot: {
        fontSize: 11,
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
    },
    matchText: {
        fontSize: 11,
        fontWeight: '600',
    },
})