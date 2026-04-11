import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet,
    Text, TextInput, View } from 'react-native';
import { feedStore, useFeed } from '../../hooks/recipe/useRecipeFeed';
import { colors } from '../../theme/color';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { FeedRecipe } from '../../types/recipe';
import { RecipeCard } from './components/RecipeCard';

export default function RecipeFeedScreen() {
    const {
        recipes, loading, refreshing, loadFeed, loadMore, refresh, toggleFavorite, search, handleSearch
    } = useFeed()

    useFocusEffect(
        useCallback(() => {
            const savedSearch = feedStore.getSearch()
            loadFeed(1, false, savedSearch.trim() || undefined)
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

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar receitas..."
                    placeholderTextColor="#aaa"
                    value={search}
                    onChangeText={handleSearch}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                />
                <Ionicons name="search-outline" size={20} color="#aaa" style={styles.searchIcon} />
            </View>

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
        margin: 16,
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
    searchIcon: { marginLeft: 8 },

    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
})