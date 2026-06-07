import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NutritionInfo } from '@/src/types/nutrition'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
  nutrition: NutritionInfo
  portions: string
}

export function NutritionCard({ nutrition, portions }: Props) {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const portionCount = Math.max(1, Number(portions) || 1)

  const perPortion = {
    calories: Math.round(nutrition.calories / portionCount),
    protein: Math.round((nutrition.protein / portionCount) * 10) / 10,
    carbs: Math.round((nutrition.carbs / portionCount) * 10) / 10,
    fat: Math.round((nutrition.fat / portionCount) * 10) / 10,
    fiber: Math.round((nutrition.fiber / portionCount) * 10) / 10,
    sodium: Math.round((nutrition.sodium / portionCount) * 10) / 10,
  }

  const macros = [
    { label: t('recipeNutritionCard.protein'), value: perPortion.protein, unit: 'g', color: '#4A90D9' },
    { label: t('recipeNutritionCard.carbs'), value: perPortion.carbs, unit: 'g', color: '#F5A623' },
    { label: t('recipeNutritionCard.fat'), value: perPortion.fat, unit: 'g', color: '#E05C5C' },
  ]

  const totalMacroG = perPortion.protein + perPortion.carbs + perPortion.fat
  const getBarWidth = (value: number) =>
    totalMacroG > 0 ? `${Math.round((value / totalMacroG) * 100)}%` as const : '0%'

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.surface, borderColor: theme.border },
    headerTitle: { color: theme.textPrimary },
    badge: { backgroundColor: theme.primary + '18' },
    badgeText: { color: theme.primary },
    caloriesValue: { color: theme.textPrimary },
    caloriesLabel: { color: theme.textPrimary },
    barTrack: { backgroundColor: theme.border },
    barValue: { color: theme.textPrimary },
    barLabel: { color: theme.textMuted },
    dividerSmall: { backgroundColor: theme.border },
    detailRow: { backgroundColor: theme.card, borderColor: theme.border },
    detailValue: { color: theme.textPrimary },
  })

  return (
    <View style={[styles.container, dynStyles.container]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="nutrition-outline" size={18} color={theme.primary} />
          <Text style={[styles.headerTitle, dynStyles.headerTitle]}>{t('recipeNutritionCard.title')}</Text>
          <View style={[styles.badge, dynStyles.badge]}>
            <Text style={[styles.badgeText, dynStyles.badgeText]}>{t('recipeNutritionCard.perPortion')}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.primary}
        />
      </TouchableOpacity>

      <View style={styles.caloriesRow}>
        <Text style={[styles.caloriesValue, dynStyles.caloriesValue]}>{perPortion.calories}</Text>
        <Text style={[styles.caloriesLabel, dynStyles.caloriesLabel]}>kcal</Text>
        <Text style={styles.caloriesNote}>{t('recipeNutritionCard.portionNote', { count: portionCount })}</Text>
      </View>

      <View style={styles.barsContainer}>
        {macros.map(macro => (
          <View key={macro.label} style={styles.barRow}>
            <Text style={[styles.barLabel, dynStyles.barLabel]}>{macro.label}</Text>
            <View style={[styles.barTrack, dynStyles.barTrack]}>
              <View style={[styles.barFill, { width: getBarWidth(macro.value), backgroundColor: macro.color }]} />
            </View>
            <Text style={[styles.barValue, dynStyles.barValue]}>{macro.value}{macro.unit}</Text>
          </View>
        ))}
      </View>

      {expanded && (
        <View style={styles.detailsContainer}>
          <View style={[styles.dividerSmall, dynStyles.dividerSmall]} />
          <View style={styles.detailsGrid}>
            <DetailRow label={t('recipeNutritionCard.fiber')} value={`${perPortion.fiber}g`} theme={theme} />
            <DetailRow label={t('recipeNutritionCard.sodium')} value={`${perPortion.sodium}mg`} theme={theme} />
          </View>
          <Text style={styles.disclaimer}>
            {t('recipeNutritionCard.disclaimer')}
          </Text>
        </View>
      )}
    </View>
  )
}

function DetailRow({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <View style={[styles.detailRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8f6',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ede8e4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7A0000',
  },
  badge: {
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 16,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7A0000',
  },
  caloriesLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A0000',
  },
  caloriesNote: {
    fontSize: 11,
    color: '#aaa',
    marginLeft: 4,
  },
  barsContainer: { 
    gap: 8 
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#555',
    width: 88,
  },
  barTrack: {
    flex: 1,
    height: 7,
    backgroundColor: '#ede8e4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A0000',
    width: 36,
    textAlign: 'right',
  },
  dividerSmall: {
    height: 1,
    backgroundColor: '#ede8e4',
    marginVertical: 14,
  },
  detailsContainer: {},
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailRow: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ede8e4',
  },
  detailLabel: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7A0000',
  },
  disclaimer: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
})