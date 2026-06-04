import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { useTranslation } from 'react-i18next'

interface Props {
    portions: number
    originalPortions: number
    onIncrement: () => void
    onDecrement: () => void
}

export function PortionSelector({ portions, originalPortions, onIncrement, onDecrement }: Props) {
    const { t } = useTranslation()
    const isOriginal = portions === originalPortions

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.label}>{t('recipePortionSelector.label')}</Text>
                {isOriginal && (
                    <Text style={styles.question}>{t('recipePortionSelector.question')}</Text>
                )}
                {!isOriginal && (
                    <Text style={styles.originalHint}>
                        {t('recipePortionSelector.originalHint', { count: originalPortions })}
                    </Text>
                )}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.btn, portions <= 1 && styles.btnDisabled]}
                    onPress={onDecrement}
                    disabled={portions <= 1}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="remove" size={16} color={portions <= 1 ? '#ccc' : colors.primary} />
                </TouchableOpacity>

                <Text style={styles.value}>{portions}</Text>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={onIncrement}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="add" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ede8e4',
    },
    left: {
        gap: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    question: {
        fontSize: 11,
        color: '#aaa',
    },
    originalHint: {
        fontSize: 11,
        color: '#aaa',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    btn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#ede8e4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDisabled: {
        borderColor: '#f0f0f0',
        backgroundColor: '#fafafa',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        minWidth: 28,
        textAlign: 'center',
    },
})