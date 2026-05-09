import React from 'react'
import {
    View, Text, ScrollView, StyleSheet,
    ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { colors } from '@/src/theme/color'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { useShoppingList } from '@/src/hooks/shoppingList/useShoppingList'
import { SummaryBanner } from './components/SummaryBanner'
import { CategorySection } from './components/CategorySection'
import { SearchBar } from '@/src/components/SearchBar'
import { router } from 'expo-router'
import { formatWeekRange } from '@/src/utils/formatWeekUtil'

export default function ShoppingListScreen() {
    const {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        filteredItems,
        handleToggleBought,
        handleOpenAdd, handleOpenEdit, handleDeleteItem,
    } = useShoppingList()

    useFocusEffect(
        useCallback(() => {
            onRefresh()
        }, [])
    )

    const isEmpty = !shoppingList || shoppingList.items.length === 0
    const pendingCount = shoppingList?.items.filter(i => !i.bought).length ?? 0
    const boughtCount = shoppingList?.items.filter(i => i.bought).length ?? 0

    const grouped = filteredItems.reduce<Record<string, typeof filteredItems>>((acc, item) => {
        const cat = item.category ?? 'Outros'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
    }, {})

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Lista de Compras</Text>
                    <Text style={styles.headerSub}>Gerada automaticamente do seu planejamento!</Text>
                    {shoppingList?.weekStart && (
                        <Text style={styles.headerWeek}>
                            Semana: {formatWeekRange(shoppingList.weekStart)}
                        </Text>
                    )}
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
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                        }
                        contentContainerStyle={styles.scrollContent}
                    >
                        {!isEmpty && (
                            <View style={styles.searchRow}>
                                <SearchBar
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder="Buscar ingrediente..."
                                />
                            </View>
                        )}

                        {!isEmpty && (
                            <SummaryBanner pending={pendingCount} bought={boughtCount} />
                        )}

                        {!isEmpty && Object.entries(grouped).map(([cat, items]) => (
                            <CategorySection
                                key={cat}
                                category={cat}
                                items={items}
                                onToggle={handleToggleBought}
                                onEdit={handleOpenEdit}
                                onDelete={handleDeleteItem}
                            />
                        ))}

                        {isEmpty && (
                            <View style={styles.emptyBanner}>
                                <View style={styles.emptyIllustration}>
                                    <Ionicons name="cart-outline" size={64} color={colors.primary} style={{ opacity: 0.35 }} />
                                </View>
                                <Text style={styles.emptyTitle}>Sua lista de compras{'\n'}está vazia</Text>
                                <Text style={styles.emptySubText}>
                                    {message ?? 'Adicione receitas ao seu planejamento\nsemanal para gerar sua lista\nautomaticamente.'}
                                </Text>
                                <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/planning')}>
                                    <Ionicons name="calendar-outline" size={16} color={colors.white} />
                                    <Text style={styles.emptyBtnText}>Ir para o Planejamento Semanal</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </View>

            <TouchableOpacity style={styles.fab} onPress={handleOpenAdd}>
                <Ionicons name="add" size={26} color={colors.white} />
            </TouchableOpacity>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    headerWeek: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 3,
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
        color: colors.white,
    },
    body: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    loadingWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingTop: 20,
    },
    searchRow: { marginBottom: 12 },
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    emptyBanner: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 36,
        marginTop: 20,
        gap: 8,
    },
    emptyIllustration: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF0EC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        textAlign: 'center',
        lineHeight: 26,
    },
    emptySubText: {
        fontSize: 13,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
    },
    emptyBtn: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        borderRadius: 25,
        paddingHorizontal: 24,
        paddingVertical: 13,
    },
    emptyBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 14,
    },
})