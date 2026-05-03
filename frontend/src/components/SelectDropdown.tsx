import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'

type Props = {
    value: string
    placeholder?: string
    options: readonly string[]
    open: boolean
    onToggle: () => void
    onSelect: (value: string) => void
    error?: string
    maxHeight?: number
}

export function SelectDropdown({
    value,
    placeholder = 'Selecione uma opção',
    options,
    open,
    onToggle,
    onSelect,
    error,
    maxHeight = 180,
}: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.select, error ? styles.selectError : null]}
                onPress={onToggle}
            >
                <Text style={[styles.selectText, !value && styles.placeholder]}>
                    {value || placeholder}
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
                            {options.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.dropdownItem,
                                        value === opt && styles.dropdownItemActive,
                                    ]}
                                    onPress={() => onSelect(opt)}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            value === opt && styles.dropdownTextActive,
                                        ]}
                                    >
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
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