import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    autoFocus?: boolean
}

export function SearchBar({ value, onChangeText, placeholder = 'Pesquisar...', autoFocus = false }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
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
        backgroundColor: '#fff',
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