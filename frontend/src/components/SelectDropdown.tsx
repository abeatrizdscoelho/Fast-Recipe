import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
    const resolvedPlaceholder = placeholder || t('components.selectDropdown.placeholder')

    const normalize = (opt: Option) =>
        typeof opt === 'string' ? { key: opt, label: opt } : opt

    const selectedLabel = options.map(normalize).find(o => o.key === value)?.label ?? value

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.select, error ? styles.selectError : null]}
                onPress={onToggle}
            >
                <Text style={[styles.selectText, !value && styles.placeholder]}>
                    {value ? selectedLabel : resolvedPlaceholder}
                </Text>
                <Ionicons 
                    name={open ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color="#aaa" 
                    />
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownWrapper}>
                    <View style={styles.dropdown}>
                        <ScrollView nestedScrollEnabled style={{ maxHeight }}>
                            {options.map(opt => {
                                const { key, label } = normalize(opt)  
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.dropdownItem,
                                            value === key && styles.dropdownItemActive, 
                                        ]}
                                        onPress={() => onSelect(key)}  
                                    >
                                        <Text style={[
                                            styles.dropdownText,
                                            value === key && styles.dropdownTextActive,  
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
        borderColor: colors.error ?? '#e05c5c',
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
        color: colors.primary,
        fontWeight: 'bold',
    },
})