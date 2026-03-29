import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet,
    Text, TextInput, View } from 'react-native';
import { useFeed } from '../../hooks/recipe/useRecipeFeed';
import { colors } from '../../theme/color';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { FeedRecipe } from '../../types/recipe';
import { RecipeCard } from './components/RecipeCard';

export default function RecipeFeedScreen() {
    const { recipes, loading, refreshing, loadFeed, loadMore, refresh, toggleFavorite } = useFeed()

    useFocusEffect(
        useCallback(() => {
            loadFeed(1, true)
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

    return (
        <View style={styles.container}>
            <Header />

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
                ListHeaderComponent={
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar receitas..."
                            placeholderTextColor="#aaa"
                        />
                        <Ionicons name="search-outline" size={20} color="#aaa" style={styles.searchIcon} />
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.empty}>
                            <ActivityIndicator size="large" color="rgba(255,255,255,0.4)" />
                        </View>
                    ) : (
                        <View style={styles.empty}>
                            <Ionicons name="restaurant-outline" size={48} color="rgba(255,255,255,0.2)" />
                            <Text style={styles.emptyText}>Nenhuma receita publicada ainda.</Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    loading && recipes.length > 0 ? (
                        <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" style={{ marginVertical: 16 }} />
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