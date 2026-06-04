import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { ShoppingListItem } from '@/src/types/shoppingList'
import { ShoppingItem } from './ShoppingItem'
import { useTranslation } from 'react-i18next'
import { useAppConstants } from '@/src/hooks/useAppConstants'

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    drinks: 'wine-outline',
    meatAndEggs: 'restaurant-outline',
    frozen: 'snow-outline',
    sweets: 'ice-cream-outline',
    canned: 'archive-outline',
    fruitsAndVegetables: 'nutrition-outline',
    produce: 'nutrition-outline',
    dairy: 'water-outline',
    bakery: 'cafe-outline',
    grainsAndCereals: 'leaf-outline',
    pasta: 'pizza-outline',
    spices: 'flower-outline',
    others: 'basket-outline',
}

interface Props {
    category: string
    items: ShoppingListItem[]
    onToggle: (item: ShoppingListItem) => void
    onEdit?: (item: ShoppingListItem) => void
    onDelete?: (item: ShoppingListItem) => void
}

export function CategorySection({ category, items, onToggle, onEdit, onDelete }: Props) {
    const { t } = useTranslation()
    const { INGREDIENT_CATEGORIES } = useAppConstants()
    const [expanded, setExpanded] = useState(true)
    const icon = CATEGORY_ICONS[category] ?? 'basket-outline'
    const label = INGREDIENT_CATEGORIES.find(c => c.key === category)?.label ?? category

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => setExpanded(p => !p)} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={18} color={colors.primary} />
                </View>

                <Text style={styles.title}>{label}</Text>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {items.length} {t('shoppingList.item', { count: items.length })}
                    </Text>
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