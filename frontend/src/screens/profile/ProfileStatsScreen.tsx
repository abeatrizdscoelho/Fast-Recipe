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
import { MonthStat, CategoryStat } from '../../types/stats'
import { useProfileStats } from '@/src/hooks/profile/useProfileStats'
import { BAR_COLORS, formatMonth } from '@/src/utils/statsUtil'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'
import { lightColors } from '@/src/theme/color'

type ThemeColors = typeof lightColors
type IoniconsName = ComponentProps<typeof Ionicons>['name']

function StatCard({ icon, label, value, theme }: { icon: IoniconsName; label: string; value: number; theme: ThemeColors }) {
    const dynStyles = StyleSheet.create({
        statCard: { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
        statValue: { color: theme.textPrimary },
        statLabel: { color: theme.textPrimary },
    })
    return (
        <View style={[styles.statCard, dynStyles.statCard]}>
            <View style={styles.statIconBox}>
                <Ionicons name={icon} size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, dynStyles.statValue]}>{value}</Text>
            <Text style={[styles.statLabel, dynStyles.statLabel]}>{label}</Text>
        </View>
    )
}

function SectionCard({ title, icon, children, theme }: { title: string; icon: IoniconsName; children: React.ReactNode; theme: ThemeColors }) {
    const dynStyles = StyleSheet.create({
        sectionCard: { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
        sectionTitle: { color: theme.textPrimary },
    })
    return (
        <View style={[styles.sectionCard, dynStyles.sectionCard]}>
            <View style={styles.sectionHeader}>
                <Ionicons name={icon} size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{title}</Text>
            </View>
            {children}
        </View>
    )
}

function BarChart({ data, maxValue, theme }: { data: MonthStat[]; maxValue: number; theme: ThemeColors }) {
    const dynStyles = StyleSheet.create({
        barBackground: { backgroundColor: theme.border },
        barCount: { color: theme.textMuted },
        barLabel: { color: theme.textMuted },
    })
    return (
        <View style={styles.chartContainer}>
            {data.map((item, index) => {
                const heightPct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
                const color = BAR_COLORS[index % BAR_COLORS.length]
                return (
                    <View key={item.month} style={styles.barWrapper}>
                        <Text style={[styles.barCount, dynStyles.barCount]}>{item.count}</Text>
                        <View style={[styles.barBackground, dynStyles.barBackground]}>
                            <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={[styles.barLabel, dynStyles.barLabel]}>{formatMonth(item.month)}</Text>
                    </View>
                )
            })}
        </View>
    )
}

function HorizontalBar({ item, maxValue, color, theme }: { item: CategoryStat; maxValue: number; color: string; theme: ThemeColors }) {
    const { t } = useTranslation()
    const widthPct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
    const dynStyles = StyleSheet.create({
        hBarLabel: { color: theme.textPrimary },
        hBarBackground: { backgroundColor: theme.border },
        hBarCount: { color: theme.textMuted },
    })
    return (
        <View style={styles.hBarRow}>
            <Text style={[styles.hBarLabel, dynStyles.hBarLabel]} numberOfLines={1}>
                {t(`categories.${item.category}`, item.category)}
            </Text>
            <View style={[styles.hBarBackground, dynStyles.hBarBackground]}>
                <View style={[styles.hBarFill, { width: `${widthPct}%`, backgroundColor: color }]} />
            </View>
            <Text style={[styles.hBarCount, dynStyles.hBarCount]}>{item.count}</Text>
        </View>
    )
}

function EmptyState({ icon, text, theme }: { icon: IoniconsName; text: string; theme: ThemeColors }) {
    const dynStyles = StyleSheet.create({
        emptyText: { color: theme.textMuted },
    })
    return (
        <View style={styles.emptyChart}>
            <Ionicons name={icon} size={36} color={theme.textMuted} />
            <Text style={[styles.emptyText, dynStyles.emptyText]}>{text}</Text>
        </View>
    )
}

export default function ProfileStatsScreen() {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const { stats, fetching, loadStats, maxCooked, maxFavorites } = useProfileStats()

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        card: { backgroundColor: theme.card },
        pageTitle: { color: theme.textPrimary },
    })

    useFocusEffect(
        useCallback(() => {
            loadStats()
        }, [loadStats])
    )

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                extraScrollHeight={32}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.card, dynStyles.card]}>
                    <Text style={[styles.pageTitle, dynStyles.pageTitle]}>{t('profileStats.title')}</Text>

                    {fetching ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : (
                        <>
                            <View style={styles.statsRow}>
                                <StatCard icon="flame-outline" label={t('profileStats.statCooked')} value={stats?.totalCooked ?? 0} theme={theme} />
                                <StatCard icon="heart-outline" label={t('profileStats.statFavorites')} value={stats?.totalFavorites ?? 0} theme={theme} />
                                <StatCard icon="book-outline" label={t('profileStats.statCreated')} value={stats?.totalRecipesCreated ?? 0} theme={theme} />
                            </View>

                            <SectionCard title={t('profileStats.sectionCookedByMonth')} icon="bar-chart-outline" theme={theme}>
                                {stats && stats.cookedByMonth.length > 0 ? (
                                    <BarChart data={stats.cookedByMonth} maxValue={maxCooked} theme={theme} />
                                ) : (
                                    <EmptyState icon="bar-chart-outline" text={t('profileStats.emptyData')} theme={theme} />
                                )}
                            </SectionCard>

                            <SectionCard title={t('profileStats.sectionFavoritesByCategory')} icon="heart-outline" theme={theme}>
                                {stats && stats.favoritesByCategory.length > 0 ? (
                                    <View style={styles.hBarsContainer}>
                                        {stats.favoritesByCategory.map((item, index) => (
                                            <HorizontalBar
                                                key={item.category}
                                                item={item}
                                                maxValue={maxFavorites}
                                                color={BAR_COLORS[index % BAR_COLORS.length]}
                                                theme={theme}
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    <EmptyState icon="pie-chart-outline" text={t('profileStats.emptyFavorites')} theme={theme} />
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
        backgroundColor: '#7A0000',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
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
        color: '#7A0000',
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
        color: '#7A0000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#7A0000',
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
        color: '#7A0000',
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
        color: '#7A0000',
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