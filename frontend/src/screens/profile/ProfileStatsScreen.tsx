import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { ComponentProps, useCallback } from 'react'
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BottomNav } from '../../components/BottomNav'
import { Header } from '../../components/Header'
import { colors } from '../../theme/color'
import { MonthStat, CategoryStat } from '../../types/stats'
import { useProfileStats } from '@/src/hooks/profile/useProfileStats'
import { BAR_COLORS, formatMonth } from '@/src/utils/statsUtil'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

function StatCard({ icon, label, value }: { icon: IoniconsName; label: string; value: number }) {
    return (
        <View style={styles.statCard}>
            <View style={styles.statIconBox}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    )
}

function SectionCard({ title, icon, children }: { title: string; icon: IoniconsName; children: React.ReactNode }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name={icon} size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </View>
    )
}

function BarChart({ data, maxValue }: { data: MonthStat[]; maxValue: number }) {
    return (
        <View style={styles.chartContainer}>
            {data.map((item, index) => {
                const heightPct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
                const color = BAR_COLORS[index % BAR_COLORS.length]
                return (
                    <View key={item.month} style={styles.barWrapper}>
                        <Text style={styles.barCount}>{item.count}</Text>
                        <View style={styles.barBackground}>
                            <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={styles.barLabel}>{formatMonth(item.month)}</Text>
                    </View>
                )
            })}
        </View>
    )
}

function HorizontalBar({ item, maxValue, color }: { item: CategoryStat; maxValue: number; color: string }) {
    const widthPct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
    return (
        <View style={styles.hBarRow}>
            <Text style={styles.hBarLabel} numberOfLines={1}>{item.category}</Text>
            <View style={styles.hBarBackground}>
                <View style={[styles.hBarFill, { width: `${widthPct}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.hBarCount}>{item.count}</Text>
        </View>
    )
}

function EmptyState({ icon, text }: { icon: IoniconsName; text: string }) {
    return (
        <View style={styles.emptyChart}>
            <Ionicons name={icon} size={36} color="#D0C4C0" />
            <Text style={styles.emptyText}>{text}</Text>
        </View>
    )
}

export default function ProfileStatsScreen() {
    const { stats, fetching, loadStats, maxCooked, maxFavorites } = useProfileStats()

    useFocusEffect(
        useCallback(() => {
            loadStats()
        }, [loadStats])
    )

    return (
        <View style={styles.container}>
            <Header />

            <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                extraScrollHeight={32}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.card}>
                    <Text style={styles.pageTitle}>Relatório de Estatísticas</Text>

                    {fetching ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <>
                            <View style={styles.statsRow}>
                                <StatCard icon="flame-outline" label="Cozinhadas" value={stats?.totalCooked ?? 0} />
                                <StatCard icon="heart-outline" label="Favoritas"  value={stats?.totalFavorites ?? 0} />
                                <StatCard icon="book-outline"  label="Criadas"    value={stats?.totalRecipesCreated ?? 0} />
                            </View>

                            <SectionCard title="Receitas Cozinhadas por Mês" icon="bar-chart-outline">
                                {stats && stats.cookedByMonth.length > 0 ? (
                                    <BarChart data={stats.cookedByMonth} maxValue={maxCooked} />
                                ) : (
                                    <EmptyState icon="bar-chart-outline" text="Nenhum dado ainda" />
                                )}
                            </SectionCard>

                            <SectionCard title="Receitas Favoritas por Categoria" icon="heart-outline">
                                {stats && stats.favoritesByCategory.length > 0 ? (
                                    <View style={styles.hBarsContainer}>
                                        {stats.favoritesByCategory.map((item, index) => (
                                            <HorizontalBar
                                                key={item.category}
                                                item={item}
                                                maxValue={maxFavorites}
                                                color={BAR_COLORS[index % BAR_COLORS.length]}
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    <EmptyState icon="pie-chart-outline" text="Nenhum favorito ainda" />
                                )}
                            </SectionCard>
                        </>
                    )}
                </View>
            </KeyboardAwareScrollView>

            <BottomNav />
        </View>
    )
}

const BAR_HEIGHT = 120

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 18,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
            android: { elevation: 6 },
        }),
    },
    centered: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    pageTitle: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F8F5F4',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,         
        borderColor: '#ede8e4', 
    },
    statIconBox: {
        width: 22,   
        height: 22,  
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: colors.primary,
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.9,
    },

    sectionCard: {
        backgroundColor: '#F8F5F4',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,           
        borderColor: '#ede8e4', 
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },

    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        height: BAR_HEIGHT + 36,
    },
    barWrapper: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
        height: BAR_HEIGHT + 36,
        justifyContent: 'flex-end',
    },
    barCount: {
        color: '#706561',
        fontSize: 11,
        fontWeight: '500',
    },
    barBackground: {
        width: '100%',
        height: BAR_HEIGHT,
        backgroundColor: '#EBE3E0',
        borderRadius: 8,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 8,
        opacity: 0.95,
    },
    barLabel: {
        color: '#706561',
        fontSize: 11,
        fontWeight: '500',
    },

    hBarsContainer: {
        gap: 16,
    },
    hBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    hBarLabel: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '500',
        width: 85,
    },
    hBarBackground: {
        flex: 1,
        height: 10,
        backgroundColor: '#EBE3E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    hBarFill: {
        height: '100%',
        borderRadius: 5,
        opacity: 0.95,
    },
    hBarCount: {
        color: '#706561',
        fontSize: 12,
        fontWeight: '500',
        width: 22,
        textAlign: 'right',
    },

    emptyChart: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 12,
    },
    emptyText: {
        color: '#90827D',
        fontSize: 14,
        fontWeight: '500',
    },
})