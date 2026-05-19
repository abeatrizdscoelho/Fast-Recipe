import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { ShoppingListItem } from '@/src/types/shoppingList'
import { ShoppingItem } from './ShoppingItem'

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Frutas e Verduras':  'nutrition-outline',
    'Laticínios':         'water-outline',
    'Temperos':           'flower-outline',
    'Carnes e Ovos':      'restaurant-outline',
    'Grãos e Cereais':    'leaf-outline',
    'Padaria':            'cafe-outline',
    'Bebidas':            'wine-outline',
    'Congelados':         'snow-outline',
    'Enlatados':          'archive-outline',
    'Massas':             'pizza-outline',
    'Doces':              'ice-cream-outline',
    'Hortifruti':         'nutrition-outline',
    'Outros':             'basket-outline',
}

interface Props {
    category: string
    items: ShoppingListItem[]
    onToggle: (item: ShoppingListItem) => void
    onEdit?: (item: ShoppingListItem) => void
    onDelete?: (item: ShoppingListItem) => void
}

export function CategorySection({ category, items, onToggle, onEdit, onDelete }: Props) {
    const [expanded, setExpanded] = useState(true)
    const icon = CATEGORY_ICONS[category] ?? 'basket-outline'

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => setExpanded(p => !p)} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.title}>{category}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{items.length} {items.length === 1 ? 'item' : 'itens'}</Text>
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#aaa"
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.list}>
                    {items.map(item => (
                        <ShoppingItem
                            key={item.ingredientIds.join('-')}
                            item={item}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 10,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FFF0EC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
    },
    badge: {
        backgroundColor: '#FFF0EC',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginRight: 4,
    },
    badgeText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    list: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
})