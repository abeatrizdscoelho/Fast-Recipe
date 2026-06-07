import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { DAY_KEYS } from '@/src/types/mealPlan'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

interface Props {
  weekDates: Date[]
  selectedDay: number
  onSelectDay: (index: number) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}

export function WeekDayPicker({ weekDates, selectedDay, onSelectDay, onPrevWeek, onNextWeek }: Props) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const dynStyles = StyleSheet.create({
    wrapper: { backgroundColor: theme.card },
    dayBtnActive: { backgroundColor: theme.primary },
    dayLabel: { color: theme.textMuted },
    dayNum: { color: theme.textPrimary },
    dayNumToday: { color: theme.primary },
    todayDot: { backgroundColor: theme.primary },
  })

  return (
    <View style={[styles.wrapper, dynStyles.wrapper]}>
      <TouchableOpacity onPress={onPrevWeek} style={styles.navBtn}>
        <Ionicons name="chevron-back" size={20} color={theme.primary} />
      </TouchableOpacity>

      <View style={styles.daysRow}>
        {weekDates.map((date, index) => {
          const isSelected = selectedDay === index
          const isToday = date.toDateString() === new Date().toDateString()
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayBtn, isSelected && dynStyles.dayBtnActive]}
              onPress={() => onSelectDay(index)}
            >
              <Text style={[styles.dayLabel, dynStyles.dayLabel, isSelected && styles.dayLabelActive]}>
                {t(`dayLabels.${DAY_KEYS[index]}`)}
              </Text>
              <Text style={[styles.dayNum, dynStyles.dayNum, isSelected && styles.dayNumActive, isToday && !isSelected && dynStyles.dayNumToday]}>
                {date.getDate()}
              </Text>
              {isToday && <View style={[styles.todayDot, dynStyles.todayDot, isSelected && styles.todayDotActive]} />}
            </TouchableOpacity>
          )
        })}
      </View>

      <TouchableOpacity onPress={onNextWeek} style={styles.navBtn}>
        <Ionicons name="chevron-forward" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  navBtn: {
    padding: 4
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dayBtn: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 36,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4
  },
  dayLabelActive: {
    color: colors.white
  },
  dayNum: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  dayNumActive: {
    color: colors.white
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  todayDotActive: {
    backgroundColor: colors.white
  },
})