import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Option = string | { key: string; label: string }

type Props = {
    value: string
    placeholder?: string
    options: readonly Option[]
    open: boolean
    onToggle: () => void
    onSelect: (value: string) => void
    error?: string
    maxHeight?: number
}

export function SelectDropdown({ value, placeholder, options, open, onToggle, onSelect, error, maxHeight = 180 }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const resolvedPlaceholder = placeholder || t('components.selectDropdown.placeholder')

    const normalize = (opt: Option) =>
        typeof opt === 'string' ? { key: opt, label: opt } : opt

    const selectedLabel = options.map(normalize).find(o => o.key === value)?.label ?? value

    const dynStyles = StyleSheet.create({
        select: { backgroundColor: theme.surface, borderColor: theme.border },
        selectText: { color: theme.textPrimary },
        dropdown: { backgroundColor: theme.card, borderColor: theme.border },
        dropdownItem: { borderBottomColor: theme.divider },
        dropdownItemActive: { backgroundColor: theme.surfaceSecondary },
        dropdownTextActive: { color: theme.primary },
    })

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.select, dynStyles.select, error ? styles.selectError : null]}
                onPress={onToggle}
            >
                <Text style={[styles.selectText, dynStyles.selectText, !value && styles.placeholder]}>
                    {value ? selectedLabel : resolvedPlaceholder}
                </Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.textMuted}
                />
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownWrapper}>
                    <View style={[styles.dropdown, dynStyles.dropdown]}>
                        <ScrollView nestedScrollEnabled style={{ maxHeight }}>
                            {options.map(opt => {
                                const { key, label } = normalize(opt)
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.dropdownItem,
                                            dynStyles.dropdownItem,
                                            value === key && styles.dropdownItemActive,
                                            value === key && dynStyles.dropdownItemActive,
                                        ]}
                                        onPress={() => onSelect(key)}
                                    >
                                        <Text style={[
                                            styles.dropdownText,
                                            dynStyles.selectText,
                                            value === key && styles.dropdownTextActive,
                                            value === key && dynStyles.dropdownTextActive,
                                        ]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#fafafa',
    },
    selectError: {
        borderColor: '#DC2626',
    },
    selectText: {
        fontSize: 14,
        color: '#333',
    },
    placeholder: {
        color: '#aaa',
    },
    dropdownWrapper: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 999,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginTop: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 6,
    },
    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemActive: {
        backgroundColor: '#FFF5EC',
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    dropdownTextActive: {
        color: '#7A0000',
        fontWeight: 'bold',
    },
})