import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BottomNav } from '../../components/BottomNav'
import { Header } from '../../components/Header'
import { useRecentRecipes } from '../../hooks/recipe/useRecentRecipes'
import { RecipeCard } from '../recipe/components/RecipeCard'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

export default function ProfileHistoryScreen() {
    const { user } = useAuth()
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const { recipes, fetching, loadRecipes, handleClear } = useRecentRecipes()

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        sectionTitle: { color: theme.cream },
        clearText: { color: theme.cream },
    })

    useFocusEffect(
        useCallback(() => {
            loadRecipes()
        }, [loadRecipes])
    )

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <FlatList
                data={recipes}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.headerRow}>
                        <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('profileHistory.title')}</Text>
                        {recipes.length > 0 && (
                            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                                <Ionicons name="trash-outline" size={16} color={theme.cream} />
                                <Text style={[styles.clearText, dynStyles.clearText]}>{t('profileHistory.clear')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    fetching ? (
                        <View style={styles.empty}>
                            <ActivityIndicator size="large" color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(122,0,0,0.3)'} />
                        </View>
                    ) : (
                        <View style={styles.empty}>
                            <Ionicons name="time-outline" size={48} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(122,0,0,0.15)'} />
                            <Text style={styles.emptyText}>
                                {t('profileHistory.empty')}
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item }) => (
                    <RecipeCard
                        id={item.id}
                        title={item.title}
                        time={item.time}
                        difficulty={item.difficulty}
                        description={item.description}
                        photos={item.photos[0]}
                        favorite={item.favorite}
                        isOwner={item.authorId === user?.id}
                        onFavorite={() => { }}
                        onEdit={(id) => router.push({ pathname: '/recipe/edit', params: { id } })}
                        onDelete={() => { }}
                    />
                )}
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
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        color: '#DDBC9B',
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    clearText: {
        color: '#DDBC9B',
        fontSize: 13,
    },
    empty: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },
})