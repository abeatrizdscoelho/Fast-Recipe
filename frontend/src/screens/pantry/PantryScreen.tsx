import React from 'react'
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { colors } from '@/src/theme/color'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { SearchBar } from '@/src/components/SearchBar'
import { usePantry } from '@/src/hooks/pantry/usePantry'
import { PantryItemCard } from './components/PantryItemCard'
import { useTranslation } from 'react-i18next'

export default function PantryScreen() {
    const { t } = useTranslation()
    const {
        items,
        loading,
        refreshing,
        onRefresh,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        categories,
        categoryCounts,
        filteredItems,
        handleOpenAdd,
        handleOpenEdit,
        handleDeleteItem,
        loadItems,
        isEmpty,
    } = usePantry()

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.headerSection}>
                <View>
                    <Text style={styles.headerTitle}>{t('pantry.title')}</Text>
                    <Text style={styles.headerSub}>{t('pantry.subtitle')}</Text>
                </View>
                <TouchableOpacity
                    style={styles.refreshBadge}
                    onPress={onRefresh}
                >
                    <Ionicons name="refresh-outline" size={14} color={colors.white} />
                    <Text style={styles.refreshBadgeText}>{t('pantry.refresh')}</Text>
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
                        keyboardShouldPersistTaps="handled"
                    >
                        {!isEmpty && (
                            <>
                                <View style={styles.searchRow}>
                                    <SearchBar
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder={t('pantry.searchPlaceholder')}
                                    />
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.chips}
                                    style={styles.chipsScroll}
                                >
                                    {categories.map(cat => (
                                        <TouchableOpacity
                                            key={cat.key}
                                            style={[styles.chip, selectedCategory === cat.key && styles.chipActive]}
                                            onPress={() => setSelectedCategory(cat.key)}
                                        >
                                            <Text style={[styles.chipText, selectedCategory === cat.key && styles.chipTextActive]}>
                                                {cat.label} ({categoryCounts[cat.key] ?? 0})
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={styles.itemsList}>
                                    {filteredItems.map(item => (
                                        <PantryItemCard
                                            key={item.id}
                                            item={item}
                                            onEdit={handleOpenEdit}
                                            onDelete={handleDeleteItem}
                                        />
                                    ))}
                                </View>
                            </>
                        )}

                        {!isEmpty && (
                            <TouchableOpacity
                                style={styles.suggestionsBanner}
                                onPress={() => router.push('/pantry/suggestions')}
                                activeOpacity={0.85}
                            >
                                <View style={styles.suggestionsBannerIcon}>
                                    <Ionicons name="color-wand-outline" size={22} color={colors.primary} />
                                </View>
                                <View style={styles.suggestionsBannerText}>
                                    <Text style={styles.suggestionsBannerTitle}>{t('pantry.suggestionsTitle')}</Text>
                                    <Text style={styles.suggestionsBannerSub}>{t('pantry.suggestionsSub')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                            </TouchableOpacity>
                        )}

                        {isEmpty && (
                            <View style={styles.emptyBanner}>
                                <View style={styles.emptyIllustration}>
                                    <Ionicons name="basket-outline" size={56} color={colors.primary} style={{ opacity: 0.3 }} />
                                </View>
                                <Text style={styles.emptyTitle}>{t('pantry.emptyTitle')}</Text>
                                <Text style={styles.emptySubText}>{t('pantry.emptySub')}</Text>
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
    container: { 
        flex: 1, 
        backgroundColor: colors.primary 
    },

    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
        lineHeight: 17,
    },

    refreshBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 14, 
    },
    refreshBadgeText: {
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

    chipsScroll: { marginBottom: 12 },
    chips: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 2,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#e0d6d0',
        backgroundColor: '#fff',
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#fff',
        fontWeight: '700',
    },

    searchRow: { marginBottom: 12 },
    itemsList: { gap: 0 },

    emptyBanner: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 36,
        marginBottom: 16,
        gap: 8,
    },
    emptyIllustration: {
        width: 110,
        height: 110,
        borderRadius: 55,
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
    },
    emptySubText: {
        fontSize: 13,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
    },

    suggestionsBanner: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    suggestionsBannerIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF0EC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionsBannerText: { flex: 1 },
    suggestionsBannerTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#222',
    },
    suggestionsBannerSub: {
        fontSize: 11,
        color: '#aaa',
        marginTop: 2,
        lineHeight: 16,
    },
})