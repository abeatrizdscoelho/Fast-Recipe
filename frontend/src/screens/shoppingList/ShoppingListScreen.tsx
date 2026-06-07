import React, { useEffect } from 'react'
import {
    View, Text, ScrollView, StyleSheet,
    ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { useShoppingList } from '@/src/hooks/shoppingList/useShoppingList'
import { SummaryBanner } from './components/SummaryBanner'
import { CategorySection } from './components/CategorySection'
import { SearchBar } from '@/src/components/SearchBar'
import { router } from 'expo-router'
import { formatWeekRange } from '@/src/utils/formatWeekUtil'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

export default function ShoppingListScreen() {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const {
        shoppingList,
        loading, refreshing, onRefresh,
        message,
        search, setSearch,
        filteredItems,
        handleToggleBought,
        handleOpenAdd, handleOpenEdit, handleDeleteItem,
        isEmpty,
        pendingCount,
        boughtCount,
        grouped,
    } = useShoppingList()

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        body: { backgroundColor: isDark ? '#181818' : '#f5f5f5' },
        emptyBanner: { backgroundColor: theme.card },
        emptyIllustration: { backgroundColor: isDark ? theme.surfaceSecondary : '#FFF0EC' },
        emptyTitle: { color: theme.primary },
        fab: { backgroundColor: theme.primary },
    })

    useEffect(() => {
        onRefresh()
    }, [])

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>{t('shoppingListScreen.title')}</Text>
                    <Text style={styles.headerSub}>{t('shoppingListScreen.subtitle')}</Text>
                    {shoppingList?.weekStart && (
                        <Text style={styles.headerWeek}>
                            {t('shoppingListScreen.weekPrefix')} {formatWeekRange(shoppingList.weekStart)}
                        </Text>
                    )}
                </View>
                <TouchableOpacity style={styles.refreshBadge} onPress={onRefresh}>
                    <Ionicons name="refresh-outline" size={14} color={colors.white} />
                    <Text style={styles.refreshText}>{t('shoppingListScreen.refreshAction')}</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.body, dynStyles.body]}>
                {loading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                        }
                        contentContainerStyle={styles.scrollContent}
                    >
                        {!isEmpty && (
                            <View style={styles.searchRow}>
                                <SearchBar
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder={t('shoppingListScreen.searchPlaceholder')}
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
                            <View style={[styles.emptyBanner, dynStyles.emptyBanner]}>
                                <View style={[styles.emptyIllustration, dynStyles.emptyIllustration]}>
                                    <Ionicons name="cart-outline" size={64} color={theme.primary} style={{ opacity: 0.35 }} />
                                </View>
                                <Text style={[styles.emptyTitle, dynStyles.emptyTitle]}>{t('shoppingListScreen.emptyTitle')}</Text>
                                <Text style={styles.emptySubText}>
                                    {message ?? t('shoppingListScreen.emptyDefaultMessage')}
                                </Text>
                                <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: theme.primary }]} onPress={() => router.push('/planning')}>
                                    <Ionicons name="calendar-outline" size={16} color={colors.white} />
                                    <Text style={styles.emptyBtnText}>{t('shoppingListScreen.emptyAction')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </View>

            <TouchableOpacity style={[styles.fab, dynStyles.fab]} onPress={handleOpenAdd}>
                <Ionicons name="add" size={26} color={colors.white} />
            </TouchableOpacity>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
        borderRadius: 20,
        padding: 36,
        marginTop: 20,
        gap: 8,
    },
    emptyIllustration: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
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