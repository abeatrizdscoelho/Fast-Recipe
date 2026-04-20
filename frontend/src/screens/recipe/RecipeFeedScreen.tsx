import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet,
    Text, TextInput, TouchableOpacity, View } from 'react-native';
import { feedStore, useFeed } from '../../hooks/recipe/useRecipeFeed';
import { colors } from '../../theme/color';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { FeedRecipe } from '../../types/recipe';
import { RecipeCard } from './components/RecipeCard';
import { FilterModal } from '@/src/components/FilterModal';

export default function RecipeFeedScreen() {
    const [filterVisible, setFilterVisible] = useState(false)

    const {
        recipes, loading, refreshing, loadFeed, loadMore, refresh, toggleFavorite,
        search, handleSearch, filters, handleApplyFilters
    } = useFeed()

    const activeFilterCount = filters.categories.length + filters.dietaryRestrictions.length

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
            <View style={styles.container}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
                </View>
                <BottomNav />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#aaa" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar receitas..."
                        placeholderTextColor="#aaa"
                        value={search}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                    onPress={() => setFilterVisible(true)}
                >
                    <Ionicons
                        name="options-outline"
                        size={22}
                        color={activeFilterCount > 0 ? colors.white : colors.white}
                    />
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
                        <Ionicons name="restaurant-outline" size={48} color="rgba(255,255,255,0.2)" />
                        <Text style={styles.emptyText}>
                            {search
                                ? `Nenhuma receita encontrada para "${search}".`
                                : activeFilterCount > 0
                                    ? 'Nenhuma receita encontrada com os filtros selecionados.'
                                    : 'Nenhuma receita publicada ainda.'
                            }
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    loading && recipes.length > 0 ? (
                        <ActivityIndicator
                            size="small"
                            color="rgba(255,255,255,0.4)"
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
    container: { flex: 1, backgroundColor: colors.primary },
    listContent: { paddingBottom: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
    },
    searchIcon: { marginRight: 8 },
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
        backgroundColor: colors.primary,
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

    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
})