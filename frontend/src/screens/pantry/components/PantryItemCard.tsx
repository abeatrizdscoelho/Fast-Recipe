import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { PantryItem } from '@/src/types/pantry'
import { DotsMenu } from '@/src/components/DotsMenu'
import { CATEGORY_ICONS } from '../../shoppingList/components/CategorySection'
import { pluralizeUnit } from '@/src/utils/pluralizeUnitUtil'
import { formatExpiry, isExpired, isExpiringSoon } from '@/src/utils/expiryUtil'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    item: PantryItem
    onEdit: (item: PantryItem) => void
    onDelete: (item: PantryItem) => void
}

export function PantryItemCard({ item, onEdit, onDelete }: Props) {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const icon = CATEGORY_ICONS[item.category] ?? 'basket-outline'
    const expiring = isExpiringSoon(item.expiresAt)
    const expired = isExpired(item.expiresAt)

    const dynStyles = StyleSheet.create({
        card: { backgroundColor: theme.card },
        cardExpired: { backgroundColor: isDark ? theme.surfaceSecondary : '#fafafa' },
        iconBox: { backgroundColor: isDark ? theme.iconBox : '#FFF0EC' },
        iconBoxExpired: { backgroundColor: isDark ? theme.surfaceSecondary : '#f0f0f0' },
        name: { color: theme.textPrimary },
        qty: { color: theme.textMuted },
        expiryText: { color: isDark ? 'rgba(255,255,255,0.3)' : '#bbb' },
    })

    return (
        <View style={[styles.card, dynStyles.card, expired && dynStyles.cardExpired]}>
            <View style={[styles.iconBox, dynStyles.iconBox, expired && dynStyles.iconBoxExpired]}>
                <Ionicons
                    name={icon}
                    size={22}
                    color={expired ? theme.textMuted : theme.primary}
                />
            </View>

            <View style={styles.info}>
                <Text style={[styles.name, dynStyles.name, expired && styles.nameExpired]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[styles.qty, dynStyles.qty]}>
                    {item.quantity} {pluralizeUnit(item.quantity, item.unit)}
                </Text>
                {item.expiresAt && (
                    <View style={styles.expiryRow}>
                        <Ionicons
                            name="time-outline"
                            size={11}
                            color={expired ? '#e05c5c' : expiring ? '#f39c12' : theme.textMuted}
                        />
                        <Text style={[
                            styles.expiryText,
                            dynStyles.expiryText,
                            expired && styles.expiryExpired,
                            expiring && !expired && styles.expirySoon,
                        ]}>
                            {expired ? t('pantryItem.expired') : t('pantryItem.expiry', { date: formatExpiry(item.expiresAt) })}
                        </Text>
                    </View>
                )}
            </View>

            {(expiring || expired) && (
                <View style={[styles.alertBadge, expired ? styles.alertExpired : styles.alertSoon]}>
                    <Ionicons
                        name={expired ? 'close-circle' : 'alert-circle'}
                        size={14}
                        color={expired ? '#e05c5c' : '#f39c12'}
                    />
                </View>
            )}

            <DotsMenu
                options={[
                    { label: t('pantryItem.edit'), icon: 'pencil-outline', onPress: () => onEdit(item) },
                    { label: t('pantryItem.remove'), icon: 'trash-outline', onPress: () => onDelete(item), destructive: true },
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        gap: 10,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    cardExpired: {
        opacity: 0.7,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
    },
    nameExpired: {
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    qty: {
        fontSize: 12,
    },
    expiryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 2,
    },
    expiryText: {
        fontSize: 11,
    },
    expiryExpired: {
        color: '#e05c5c',
        fontWeight: '600',
    },
    expirySoon: {
        color: '#f39c12',
        fontWeight: '600',
    },
    alertBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertExpired: {
        backgroundColor: '#FDECEA',
    },
    alertSoon: {
        backgroundColor: '#FFF8E1',
    },
})