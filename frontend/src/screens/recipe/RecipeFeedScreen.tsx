import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { feedStore, useFeed } from '../../hooks/recipe/useRecipeFeed';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { SearchBar } from '../../components/SearchBar';
import { FeedRecipe } from '../../types/recipe';
import { RecipeCard } from './components/RecipeCard';
import { FilterModal } from '@/src/components/FilterModal';
import { useTranslation } from 'react-i18next';
import { useAppConstants } from '@/src/hooks/useAppConstants';
import { useTheme } from '@/src/context/ThemeContext';

export default function RecipeFeedScreen() {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const { CATEGORIES, DIETARY_RESTRICTIONS } = useAppConstants()
    const [filterVisible, setFilterVisible] = useState(false)

    const {
        recipes, loading, refreshing, loadFeed, loadMore, refresh, toggleFavorite,
        search, handleSearch, filters, handleApplyFilters
    } = useFeed()

    const activeFilterCount = filters.categories.length + filters.dietaryRestrictions.length

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        filterBtnActive: { backgroundColor: theme.primary },
    })

    useFocusEffect(
        useCallback(() => {
            loadFeed(1, false, feedStore.getSearch().trim() || undefined, feedStore.getFilters())
        }, [])
    )

    function renderItem({ item }: { item: FeedRecipe }) {
        return (
            <RecipeCard
                id={item.id}
                title={item.title}
                time={item.time}
                difficulty={item.difficulty}
                description={item.description}
                photos={item.photos?.[0] ?? null}
                favorite={item.favorite}
                author={{
                    name: item.author.name,
                    avatarUrl: item.author.avatarUrl,
                    createdAt: item.createdAt,
                }}
                onFavorite={toggleFavorite}
            />
        )
    }

    if (loading && recipes.length === 0) {
        return (
            <View style={[styles.container, dynStyles.container]}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
                </View>
                <BottomNav />
            </View>
        )
    }

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <View style={styles.searchRow}>
                <SearchBar
                    value={search}
                    onChangeText={handleSearch}
                    placeholder={t('recipeFeed.searchPlaceholder')}
                />

                <TouchableOpacity
                    style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive, activeFilterCount > 0 && dynStyles.filterBtnActive]}
                    onPress={() => setFilterVisible(true)}
                >
                    <Ionicons name="options-outline" size={22} color={theme.white} />
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
                onApply={handleApplyFilters}
                categories={CATEGORIES}
                dietaryRestrictions={DIETARY_RESTRICTIONS}
            />

            <FlatList
                data={recipes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                refreshing={refreshing}
                onRefresh={refresh}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="restaurant-outline" size={48} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(122,0,0,0.15)'} />
                        <Text style={styles.emptyText}>
                            {search
                                ? t('recipeFeed.emptySearch', { search })
                                : activeFilterCount > 0
                                    ? t('recipeFeed.emptyFilters')
                                    : t('recipeFeed.emptyDefault')
                            }
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    loading && recipes.length > 0 ? (
                        <ActivityIndicator
                            size="small"
                            color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(122,0,0,0.3)'}
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
                }
            />

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7A0000',
    },
    listContent: { 
        paddingBottom: 16 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 16,
        gap: 5,
    },
    filterBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnActive: {
        backgroundColor: '#7A0000',
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
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    empty: { 
        alignItems: 'center', 
        paddingTop: 60, 
        gap: 12 
    },
    emptyText: { 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: 14 
    },
})