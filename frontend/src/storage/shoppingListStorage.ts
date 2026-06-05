import AsyncStorage from '@react-native-async-storage/async-storage'
import { ShoppingList } from '../types/shoppingList'

const KEY_PREFIX = '@shopping_list_'
const MANUAL_KEY = '@shopping_list_manual'

export const shoppingListStorage = {
  _key(weekStart: string): string {
    return `${KEY_PREFIX}${weekStart}`
  },

  async getByWeek(weekStart: string): Promise<ShoppingList | null> {
    const json = await AsyncStorage.getItem(this._key(weekStart))
    return json ? JSON.parse(json) : null
  },

  async save(list: ShoppingList): Promise<void> {
    await AsyncStorage.setItem(this._key(list.weekStart), JSON.stringify(list))
  },

  async updateItemBought(weekStart: string, ingredientIds: string[], bought: boolean): Promise<void> {
    const list = await this.getByWeek(weekStart)
    if (!list) return
    const key = ingredientIds.join()
    const updated: ShoppingList = {
      ...list,
      items: list.items.map(i =>
        i.ingredientIds.join() === key ? { ...i, bought } : i
      ),
    }
    await this.save(updated)
  },

  async getManualItems(): Promise<ShoppingList['items']> {
    const json = await AsyncStorage.getItem(MANUAL_KEY)
    return json ? JSON.parse(json) : []
  },

  async saveManualItems(items: ShoppingList['items']): Promise<void> {
    await AsyncStorage.setItem(MANUAL_KEY, JSON.stringify(items))
  },

  async remove(weekStart: string): Promise<void> {
    await AsyncStorage.removeItem(this._key(weekStart))
  },
}