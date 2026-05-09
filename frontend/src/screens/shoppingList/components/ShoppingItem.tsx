import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { ShoppingListItem } from '@/src/types/shoppingList'
import { ConsolidatedItem } from '@/src/utils/consolidateShoppingListUtil'
import { pluralizeUnit } from '@/src/utils/pluralizeUnitUtil'
import { DotsMenu } from '@/src/components/DotsMenu'

interface Props {
    item: ConsolidatedItem
    onToggle: (item: ShoppingListItem) => void
    onEdit?: (item: ShoppingListItem) => void
    onDelete?: (item: ShoppingListItem) => void
}

export function ShoppingItem({ item, onToggle, onEdit, onDelete }: Props) {
    return (
        <View style={[styles.row, item.bought && styles.rowBought]}>
            <TouchableOpacity
                style={[styles.checkbox, item.bought && styles.checkboxChecked]}
                onPress={() => onToggle(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {item.bought && <Ionicons name="checkmark" size={13} color={colors.white} />}
            </TouchableOpacity>

            <View style={styles.info}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.name, item.bought && styles.nameBought]}>
                        {item.name}
                    </Text>
                    {item.hasUnitConflict && (
                        <Ionicons name="alert-circle-outline" size={14} color="#f39c12" />
                    )}
                </View>
                <Text style={[styles.qty, item.bought && styles.qtyBought]}>
                    {item.quantity} {pluralizeUnit(item.quantity, item.unit)}
                </Text>
                {item.hasUnitConflict && (
                    <Text style={styles.conflictHint}>
                        Verifique: mesmo ingrediente com unidades diferentes
                    </Text>
                )}
            </View>

            <DotsMenu
                options={[
                    { label: 'Editar', icon: 'pencil-outline', onPress: () => onEdit?.(item) },
                    { label: 'Remover', icon: 'trash-outline', onPress: () => onDelete?.(item), destructive: true },
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    rowBought: { backgroundColor: '#fafafa' },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    info: { flex: 1 },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    nameBought: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    qty: {
        fontSize: 12,
        color: '#999',
        marginTop: 1,
    },
    qtyBought: {
        textDecorationLine: 'line-through',
        color: '#ccc',
    },
    conflictHint: {
        fontSize: 11,
        color: '#f39c12',
        marginTop: 2,
    },
})