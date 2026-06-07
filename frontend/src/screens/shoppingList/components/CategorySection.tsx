import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ShoppingListItem } from '@/src/types/shoppingList'
import { ShoppingItem } from './ShoppingItem'
import { useTranslation } from 'react-i18next'
import { useAppConstants } from '@/src/hooks/useAppConstants'
import { useTheme } from '@/src/context/ThemeContext'

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
    const { theme, isDark } = useTheme()
    const { INGREDIENT_CATEGORIES } = useAppConstants()
    const [expanded, setExpanded] = useState(true)
    const icon = CATEGORY_ICONS[category] ?? 'basket-outline'
    const label = INGREDIENT_CATEGORIES.find(c => c.key === category)?.label ?? category

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.card },
        iconBox: { backgroundColor: isDark ? theme.iconBox : '#FFF0EC' },
        title: { color: theme.textPrimary },
        badge: { backgroundColor: isDark ? theme.iconBox : '#FFF0EC' },
        badgeText: { color: theme.primary },
        list: { borderTopColor: theme.divider },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <TouchableOpacity style={styles.header} onPress={() => setExpanded(p => !p)} activeOpacity={0.7}>
                <View style={[styles.iconBox, dynStyles.iconBox]}>
                    <Ionicons name={icon} size={18} color={theme.primary} />
                </View>

                <Text style={[styles.title, dynStyles.title]}>{label}</Text>

                <View style={[styles.badge, dynStyles.badge]}>
                    <Text style={[styles.badgeText, dynStyles.badgeText]}>
                        {items.length} {t('shoppingList.item', { count: items.length })}
                    </Text>
                </View>

                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.textMuted}
                />
            </TouchableOpacity>

            {expanded && (
                <View style={[styles.list, dynStyles.list]}>
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
        backgroundColor: '#FFFFFF',
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
        color: '#7A0000',
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
        color: '#7A0000',
        fontWeight: '600',
    },
    list: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
})