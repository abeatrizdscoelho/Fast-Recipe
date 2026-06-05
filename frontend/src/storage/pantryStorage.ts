import AsyncStorage from '@react-native-async-storage/async-storage'
import { PantryItem } from '../types/pantry'

const KEY = '@pantry_items'

export const pantryStorage = {
    async getAll(): Promise<PantryItem[]> {
        const json = await AsyncStorage.getItem(KEY)
        return json ? JSON.parse(json) : []
    },

    async save(items: PantryItem[]): Promise<void> {
        await AsyncStorage.setItem(KEY, JSON.stringify(items))
    },

    async remove(id: string): Promise<void> {
        const current = await this.getAll()
        await this.save(current.filter(i => i.id !== id))
    },
}