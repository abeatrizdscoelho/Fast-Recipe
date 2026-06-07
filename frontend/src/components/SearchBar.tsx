import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    autoFocus?: boolean
}

export function SearchBar({ value, onChangeText, placeholder, autoFocus = false }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const resolvedPlaceholder = placeholder || t('components.searchBar.placeholder')

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.card },
        input: { color: theme.textPrimary },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Ionicons name="search-outline" size={20} color={theme.textMuted} style={styles.icon} />
            <TextInput
                style={[styles.input, dynStyles.input]}
                placeholder={resolvedPlaceholder}
                placeholderTextColor={theme.textMuted}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoFocus={autoFocus}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        paddingHorizontal: 16,
    },
    icon: { marginRight: 8 },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
    },
})