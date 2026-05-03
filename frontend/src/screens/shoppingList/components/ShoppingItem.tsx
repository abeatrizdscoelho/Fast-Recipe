import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { ShoppingListItem } from '@/src/types/shoppingList'

interface Props {
    item: ShoppingListItem
    onToggle: (item: ShoppingListItem) => void
}

export function ShoppingItem({ item, onToggle }: Props) {
    return (
        <TouchableOpacity
            style={[styles.row, item.bought && styles.rowBought]}
            onPress={() => onToggle(item)}
            activeOpacity={0.7}
        >
            <TouchableOpacity
                style={[styles.checkbox, item.bought && styles.checkboxChecked]}
                onPress={() => onToggle(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {item.bought && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </TouchableOpacity>

            <Text style={[styles.name, item.bought && styles.nameBought]}>
                {item.name}
            </Text>

            <Text style={[styles.qty, item.bought && styles.qtyBought]}>
                {item.quantity} {item.unit}
            </Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10,
        backgroundColor: colors.white, 
        borderRadius: 14,
        paddingHorizontal: 14, 
        paddingVertical: 14, 
        marginBottom: 8,
    },
    rowBought: { backgroundColor: '#f9f9f9' },
    checkbox: {
        width: 24, 
        height: 24, 
        borderRadius: 12,
        borderWidth: 2, 
        borderColor: '#ddd',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    checkboxChecked: { 
        backgroundColor: colors.primary, 
        borderColor: colors.primary 
    },
    name: { 
        flex: 1, 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#333' 
    },
    nameBought: { 
        textDecorationLine: 'line-through', 
        color: '#aaa' 
    },
    qty: { 
        fontSize: 13, 
        color: '#888' 
    },
    qtyBought: { 
        textDecorationLine: 'line-through', 
        color: '#ccc' 
    },
})