import AsyncStorage from '@react-native-async-storage/async-storage'
import { MealPlan } from '../types/mealPlan'

const KEY_PREFIX = '@meal_plan_'

export const mealPlanStorage = {
  _key(weekStart: string): string {
    return `${KEY_PREFIX}${weekStart}`
  },

  async getByWeek(weekStart: string): Promise<MealPlan | null> {
    const json = await AsyncStorage.getItem(this._key(weekStart))
    return json ? JSON.parse(json) : null
  },

  async save(mealPlan: MealPlan): Promise<void> {
    await AsyncStorage.setItem(
      this._key(mealPlan.weekStart),
      JSON.stringify(mealPlan)
    )
  },

  async remove(weekStart: string): Promise<void> {
    await AsyncStorage.removeItem(this._key(weekStart))
  },

  async getAllWeeks(): Promise<MealPlan[]> {
    const keys = await AsyncStorage.getAllKeys()
    const planKeys = keys.filter(k => k.startsWith(KEY_PREFIX))
    if (planKeys.length === 0) return []
    const pairs = await AsyncStorage.multiGet(planKeys)
    return pairs
      .map(([, value]) => (value ? JSON.parse(value) : null))
      .filter(Boolean) as MealPlan[]
  },
}