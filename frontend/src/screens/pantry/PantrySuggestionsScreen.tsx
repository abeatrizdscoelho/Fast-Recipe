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

export default function PantrySuggestionsScreen() {
    const {
        suggestions,
        loading,
        loadSuggestions,
    } = usePantrySuggestions()

    useEffect(() => {
        loadSuggestions()
    }, [])

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.headerSection}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Receitas Sugeridas</Text>
                    <Text style={styles.headerSub}>
                        Baseadas nos ingredientes da sua despensa!
                    </Text>
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
                            <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.2)" />
                            <Text style={styles.emptyText}>
                                Nenhuma receita encontrada com os ingredientes da sua despensa.
                            </Text>
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
        backgroundColor: colors.primary,
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
        color: '#fff',
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
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
})