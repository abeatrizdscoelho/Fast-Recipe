import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NutritionInfo } from '@/src/types/nutrition'
import { colors } from '@/src/theme/color'

interface Props {
  nutrition: NutritionInfo
  portions: string
}

export function NutritionCard({ nutrition, portions }: Props) {
  const [expanded, setExpanded] = useState(false)
  const portionCount = Math.max(1, Number(portions) || 1)

  // Valores por porção
  const perPortion = {
    calories: Math.round(nutrition.calories / portionCount),
    protein: Math.round((nutrition.protein  / portionCount) * 10) / 10,
    carbs: Math.round((nutrition.carbs / portionCount) * 10) / 10,
    fat: Math.round((nutrition.fat / portionCount) * 10) / 10,
    fiber: Math.round((nutrition.fiber / portionCount) * 10) / 10,
    sodium: Math.round((nutrition.sodium / portionCount) * 10) / 10,
  }

  const macros = [
    { label: 'Proteínas', value: perPortion.protein, unit: 'g', color: '#4A90D9' },
    { label: 'Carboidratos', value: perPortion.carbs, unit: 'g', color: '#F5A623' },
    { label: 'Gorduras', value: perPortion.fat, unit: 'g', color: '#E05C5C' },
  ]

  // Barras de macro: % do total de macros (exclui calorias)
  const totalMacroG = perPortion.protein + perPortion.carbs + perPortion.fat
  const getBarWidth = (value: number) =>
    totalMacroG > 0 ? `${Math.round((value / totalMacroG) * 100)}%` as const : '0%'

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="nutrition-outline" size={18} color={colors.primary} />
          <Text style={styles.headerTitle}>Informação Nutricional</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>por porção</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.primary}
        />
      </TouchableOpacity>

      <View style={styles.caloriesRow}>
        <Text style={styles.caloriesValue}>{perPortion.calories}</Text>
        <Text style={styles.caloriesLabel}>kcal</Text>
        <Text style={styles.caloriesNote}>por porção · {portionCount} {portionCount === 1 ? 'porção' : 'porções'} na receita</Text>
      </View>

      <View style={styles.barsContainer}>
        {macros.map(macro => (
          <View key={macro.label} style={styles.barRow}>
            <Text style={styles.barLabel}>{macro.label}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: getBarWidth(macro.value), backgroundColor: macro.color }]} />
            </View>
            <Text style={styles.barValue}>{macro.value}{macro.unit}</Text>
          </View>
        ))}
      </View>

      {expanded && (
        <View style={styles.detailsContainer}>
          <View style={styles.dividerSmall} />
          <View style={styles.detailsGrid}>
            <DetailRow label="Fibras" value={`${perPortion.fiber}g`} />
            <DetailRow label="Sódio" value={`${perPortion.sodium}mg`} />
          </View>
          <Text style={styles.disclaimer}>
            * Valores aproximados calculados com base nos ingredientes via USDA FoodData Central.
          </Text>
        </View>
      )}
    </View>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
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
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primary + '18',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: colors.primary,
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
    color: colors.primary,
  },
  caloriesLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  caloriesNote: {
    fontSize: 11,
    color: '#aaa',
    marginLeft: 4,
  },

  barsContainer: { gap: 8 },
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
    color: colors.primary,
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
    backgroundColor: colors.white,
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
    color: colors.primary,
  },
  disclaimer: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
})