import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'

interface Props {
    pending: number
    bought: number
}

export function SummaryBanner({ pending, bought }: Props) {
    const total = pending + bought
    const progress = total > 0 ? bought / total : 0

    return (
        <View style={styles.container}>

            <View style={styles.counters}>
                <View style={styles.side}>
                    <View style={styles.iconBox}>
                        <Ionicons name="cart-outline" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.count}>{pending}</Text>
                    <Text style={styles.label}>Pendentes</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.side}>
                    <View style={[styles.iconBox, styles.iconBoxDone]}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                    </View>
                    <Text style={[styles.count, bought > 0 && styles.countDone]}>{bought}</Text>
                    <Text style={styles.label}>Comprados</Text>
                </View>
            </View>

            {total > 0 && (
                <View style={styles.progressWrapper}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                        {Math.round(progress * 100)}% concluído
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 12,
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
        backgroundColor: '#FFF0EC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    iconBoxDone: {
        backgroundColor: '#E8F5E9',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: '#eee',
        marginHorizontal: 8,
    },
    count: {
        fontSize: 22,
        fontWeight: '800',
        color: '#222',
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
        backgroundColor: '#f0f0f0',
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