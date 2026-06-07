import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    portions: number
    originalPortions: number
    onIncrement: () => void
    onDecrement: () => void
}

export function PortionSelector({ portions, originalPortions, onIncrement, onDecrement }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const isOriginal = portions === originalPortions

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.surface, borderColor: theme.border },
        label: { color: theme.textPrimary },
        btn: { backgroundColor: theme.card, borderColor: theme.border },
        value: { color: theme.textPrimary },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <View style={styles.left}>
                <Text style={[styles.label, dynStyles.label]}>{t('recipePortionSelector.label')}</Text>
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
                    style={[styles.btn, dynStyles.btn, portions <= 1 && styles.btnDisabled]}
                    onPress={onDecrement}
                    disabled={portions <= 1}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="remove" size={16} color={portions <= 1 ? '#ccc' : theme.primary} />
                </TouchableOpacity>

                <Text style={[styles.value, dynStyles.value]}>{portions}</Text>

                <TouchableOpacity
                    style={[styles.btn, dynStyles.btn]}
                    onPress={onIncrement}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="add" size={16} color={theme.primary} />
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
        backgroundColor: '#faf8f6',
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
        color: '#7A0000',
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
        backgroundColor: '#FFFFFF',
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
        color: '#7A0000',
        minWidth: 28,
        textAlign: 'center',
    },
})