import React, { useState } from 'react'
import {
    Modal, View, Text, FlatList,
    TouchableOpacity, Image, StyleSheet, SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FeedRecipe } from '@/src/types/recipe'
import { colors } from '@/src/theme/color'
import { SearchBar } from '@/src/components/SearchBar'
import { ActiveFilters, FilterModal } from '@/src/components/FilterModal'
import { useTranslation } from 'react-i18next'
import { useAppConstants } from '@/src/hooks/useAppConstants'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
    visible: boolean
    recipes: FeedRecipe[]
    search: string
    onSearchChange: (text: string) => void
    onSelect: (recipeId: string) => void
    onClose: () => void
    filters: ActiveFilters
    onApplyFilters: (filters: ActiveFilters) => void
}

export function RecipePickerModal({ visible, recipes, search, onSearchChange, onSelect, onClose, filters, onApplyFilters }: Props) {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { CATEGORIES, DIETARY_RESTRICTIONS } = useAppConstants()
    const [filterVisible, setFilterVisible] = useState(false)
    const activeFilterCount = filters.categories.length + filters.dietaryRestrictions.length

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.surface },
        header: { backgroundColor: theme.card, borderBottomColor: theme.divider },
        title: { color: theme.primary },
        closeIcon: { color: theme.textPrimary },
        searchBarWrapper: { borderColor: theme.border },
        recipeItem: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.divider },
        recipeName: { color: theme.primary },
        recipeThumb: { backgroundColor: theme.surfaceSecondary },
        metaText: { color: theme.textMuted },
        metaDot: { color: theme.grayLight },
        emptyIcon: { color: theme.grayLight },
        emptyText: { color: theme.textMuted },
    })

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={[styles.container, dynStyles.container]}>
                <View style={[styles.header, dynStyles.header]}>
                    <Text style={[styles.title, dynStyles.title]}>{t('recipePicker.title')}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={26} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchRow}>
                    <View style={[styles.searchBarWrapper, dynStyles.searchBarWrapper]}>
                        <SearchBar
                            value={search}
                            onChangeText={onSearchChange}
                            placeholder={t('recipePicker.searchPlaceholder')}
                            autoFocus
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => setFilterVisible(true)}
                    >
                        <Ionicons name="options-outline" size={22} color={theme.textMuted} />
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FilterModal
                    visible={filterVisible}
                    filters={filters}
                    onClose={() => setFilterVisible(false)}
                    onApply={(newFilters) => {
                        onApplyFilters(newFilters)
                        setFilterVisible(false)
                    }}
                    categories={CATEGORIES}
                    dietaryRestrictions={DIETARY_RESTRICTIONS}
                />

                <FlatList
                    data={recipes}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="restaurant-outline" size={48} color={theme.grayLight} />
                            <Text style={[styles.emptyText, dynStyles.emptyText]}>{t('recipePicker.empty')}</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.recipeItem, dynStyles.recipeItem]} onPress={() => onSelect(item.id)}>
                            {item.photos?.[0] ? (
                                <Image source={{ uri: item.photos[0] }} style={styles.recipeThumb} />
                            ) : (
                                <View style={[styles.recipeThumb, styles.noPhoto, dynStyles.recipeThumb]}>
                                    <Ionicons name="restaurant-outline" size={22} color={theme.grayLight} />
                                </View>
                            )}
                            <View style={styles.recipeInfo}>
                                <Text style={[styles.recipeName, dynStyles.recipeName]} numberOfLines={1}>{item.title}</Text>
                                <View style={styles.recipeMeta}>
                                    <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                                    <Text style={[styles.metaText, dynStyles.metaText]}>{item.time}min</Text>
                                    <Text style={[styles.metaDot, dynStyles.metaDot]}>·</Text>
                                    <Text style={[styles.metaText, dynStyles.metaText]}>
                                        {t(`categories.${item.category}`, item.category)}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        gap: 8,
    },
    searchBarWrapper: {
        flex: 1,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#e74c3c',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    filterBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
        gap: 10
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    recipeThumb: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    noPhoto: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    recipeInfo: { flex: 1 },
    recipeName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    metaText: {
        fontSize: 12,
    },
    metaDot: {
        fontSize: 12,
    },
    empty: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12
    },
    emptyText: {
        fontSize: 14,
    },
})