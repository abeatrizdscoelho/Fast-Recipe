import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { colors } from '@/src/theme/color'
import { PantrySuggestion } from '@/src/types/pantry'
import { useTranslation } from 'react-i18next'

interface Props {
    item: PantrySuggestion
}

export function PantrySuggestionCard({ item }: Props) {
    const photo = item.photos?.[0]
    const { t } = useTranslation()

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })}
        >
            {photo ? (
                <Image source={{ uri: photo }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.imageFallback]}>
                    <Ionicons name="restaurant-outline" size={28} color="#ccc" />
                </View>
            )}

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                <View style={styles.meta}>
                    <Ionicons name="time-outline" size={12} color="#999" />
                    <Text style={styles.metaText}>{item.time}min</Text>
                    {item.difficulty && (
                        <>
                            <Text style={styles.metaDot}>·</Text>
                            <Text style={styles.metaText}>{item.difficulty}</Text>
                        </>
                    )}
                </View>

                <View style={styles.matchBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                    <Text style={styles.matchText}>
                        {t('pantrySuggestion.match', { count: item.matchCount, percentage: item.matchPercentage })}
                    </Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        backgroundColor: '#f5f5f5',
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
        color: colors.primary,
        lineHeight: 18,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: '#999',
    },
    metaDot: {
        fontSize: 11,
        color: '#ccc',
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF0EC',
        marginTop: 3,
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
    },
    matchText: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: '600',
    },
})