import React from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { useShoppingList } from '@/src/hooks/shoppingList/useShoppingList'
import { SummaryBanner } from './components/SummaryBanner'
import { CategoryFilter } from './components/CategoryFilter'
import { ShoppingItem } from './components/ShoppingItem'
import { SearchBar } from '@/src/components/SearchBar'
import { router } from 'expo-router'

export default function ShoppingListScreen() {
    const {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        selectedCategory, setSelectedCategory,
        sortAZ, setSortAZ,
        categories,
        filteredItems,
        totalCount,
        handleToggleBought,
    } = useShoppingList()

    const isEmpty = !shoppingList || shoppingList.items.length === 0

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Lista de Compras</Text>
                    <Text style={styles.headerSub}>Gerada automaticamente do seu planejamento!</Text>
                </View>
                <TouchableOpacity style={styles.refreshBadge} onPress={onRefresh}>
                    <Ionicons name="refresh-outline" size={14} color={colors.white} />
                    <Text style={styles.refreshText}>Atualizar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                {loading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {!isEmpty && (
                            <SummaryBanner
                                totalRecipes={shoppingList!.totalRecipes}
                                weekStart={shoppingList!.weekStart}
                            />
                        )}

                        {!isEmpty && (
                            <View style={styles.searchRow}>
                                <SearchBar
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder="Buscar ingrediente"
                                />
                            </View>
                        )}

                        {!isEmpty && (
                            <CategoryFilter
                                categories={categories}
                                selected={selectedCategory}
                                totalCount={totalCount}
                                onSelect={setSelectedCategory}
                            />
                        )}

                        {!isEmpty && (
                            <View style={styles.countRow}>
                                <Text style={styles.countText}>{filteredItems.length} itens</Text>
                                <TouchableOpacity onPress={() => setSortAZ(p => !p)} style={styles.sortBtn}>
                                    <Text style={styles.sortText}>Ordenar: {sortAZ ? 'A-Z' : 'Z-A'}</Text>
                                    <Ionicons name="chevron-down" size={14} color="#666" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {isEmpty && (
                            <View style={styles.emptyBanner}>
                                <Ionicons name="cart-outline" size={40} color={colors.primary} style={{ opacity: 0.4 }} />
                                <Text style={styles.emptyText}>
                                    {message ?? 'Nenhum item na lista de compras.'}
                                </Text>
                                <Text style={styles.emptySubText}>Adicione receitas ao planejamento para gerar sua lista!</Text>
                                <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/planning')}>
                                    <Text style={styles.emptyBtnText}>Ir para o planejamento</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {filteredItems.map(item => (
                            <ShoppingItem
                                key={item.ingredientIds.join('-')}
                                item={item}
                                onToggle={handleToggleBought}
                            />
                        ))}

                        {!isEmpty && (
                            <View style={styles.hint}>
                                <Ionicons name="bulb-outline" size={16} color={colors.primary} />
                                <Text style={styles.hintText}>
                                    Unidades diferentes não são consolidadas.
                                </Text>
                            </View>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </View>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
    header: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20, 
        paddingTop: 8, 
        paddingBottom: 16,
    },
    headerTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: colors.white 
    },
    headerSub: { 
        fontSize: 12, 
        color: 'rgba(255,255,255,0.75)', 
        marginTop: 2 
    },

    refreshBadge: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.15)', 
        borderRadius: 20,
        paddingHorizontal: 10, 
        paddingVertical: 5,
    },
    refreshText: { 
        fontSize: 11, 
        color: colors.white 
    },

    body: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20 
    },
    loadingWrapper: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    scrollContent: { 
        padding: 16, 
        paddingTop: 20 
    },
    searchRow: { 
        flexDirection: 'row', 
        marginBottom: 12 
    },

    countRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: 10,
    },
    countText: { 
        fontSize: 13, 
        color: '#999', 
        fontWeight: '600' 
    },

    sortBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 
    },
    sortText: { 
        fontSize: 13, 
        color: '#666' 
    },

    emptyBanner: {
        alignItems: 'center', 
        backgroundColor: colors.white,
        borderRadius: 16, 
        padding: 32, 
        marginTop: 20, 
        gap: 6,
    },
    emptyText: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#555', 
        marginTop: 8, 
        textAlign: 'center' 
    },
    emptySubText: { 
        fontSize: 13, 
        color: '#aaa', 
        textAlign: 'center' 
    },
    emptyBtn: {
        marginTop: 12, 
        backgroundColor: colors.primary,
        borderRadius: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10,
    },
    emptyBtnText: { 
        color: colors.white, 
        fontWeight: '700', 
        fontSize: 13 
    },

    hint: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
        backgroundColor: '#FFF8F6', 
        borderRadius: 12,
        padding: 12, 
        marginTop: 8,
    },
    hintText: { 
        flex: 1, 
        fontSize: 12, 
        color: '#888', 
        lineHeight: 17 
    },
})