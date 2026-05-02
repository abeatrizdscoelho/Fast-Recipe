import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { DAY_LABELS } from '@/src/types/mealPlan'

interface Props {
  weekDates: Date[]
  selectedDay: number
  onSelectDay: (index: number) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}

export function WeekDayPicker({ weekDates, selectedDay, onSelectDay, onPrevWeek, onNextWeek }: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPrevWeek} style={styles.navBtn}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.daysRow}>
        {weekDates.map((date, index) => {
          const isSelected = selectedDay === index
          const isToday = date.toDateString() === new Date().toDateString()
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
              onPress={() => onSelectDay(index)}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                {DAY_LABELS[index]}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumActive, isToday && !isSelected && styles.dayNumToday]}>
                {date.getDate()}
              </Text>
              {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotActive]} />}
            </TouchableOpacity>
          )
        })}
      </View>

      <TouchableOpacity onPress={onNextWeek} style={styles.navBtn}>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  navBtn: { padding: 4 },
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
  dayBtnActive: { backgroundColor: colors.primary },
  dayLabel: { 
    fontSize: 10, 
    fontWeight: '600', 
    color: '#999',
    marginBottom: 4 
  },
  dayLabelActive: { color: colors.white },
  dayNum: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  dayNumActive: { color: colors.white },
  dayNumToday: { color: colors.primary },
  todayDot: {
    width: 4, 
    height: 4, 
    borderRadius: 2,
    backgroundColor: colors.primary, 
    marginTop: 3,
  },
  todayDotActive: { backgroundColor: colors.white },
})