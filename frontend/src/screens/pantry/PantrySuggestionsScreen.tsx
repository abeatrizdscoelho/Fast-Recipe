import React, { useEffect } from 'react'
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { colors } from '@/src/theme/color'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { PantrySuggestionCard } from './components/PantrySuggestionCard'
import { usePantrySuggestions } from '@/src/hooks/pantry/usePantrySuggestions'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

export default function PantrySuggestionsScreen() {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const {
        suggestions,
        loading,
        loadSuggestions,
    } = usePantrySuggestions()

    useEffect(() => {
        loadSuggestions()
    }, [])

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        emptyIcon: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)' },
        emptyText: { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.4)' },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <View style={styles.headerSection}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>{t('pantrySuggestions.title')}</Text>
                    <Text style={styles.headerSub}>{t('pantrySuggestions.subtitle')}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
                </View>
            ) : (
                <FlatList
                    data={suggestions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <PantrySuggestionCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="search-outline" size={48} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)'} />
                            <Text style={[styles.emptyText, dynStyles.emptyText]}>{t('pantrySuggestions.empty')}</Text>
                        </View>
                    }
                />
            )}

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 6,
        gap: 10,
    },
    backBtn: {
        width: 32,
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
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
    refreshBadgeText: {
        fontSize: 11,
        color: colors.white,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    empty: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
})