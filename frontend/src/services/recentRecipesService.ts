import AsyncStorage from '@react-native-async-storage/async-storage'
import { FeedRecipe, Recipe } from '../types/recipe'

const STORAGE_KEY = '@recent_recipes'
const MAX_ITEMS = 20

export const recentRecipesService = {
    async getAll(): Promise<Recipe[]> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : []
        } catch {
            return []
        }
    },

    async add(recipe: FeedRecipe): Promise<void> {
        try {
            const current = await recentRecipesService.getAll()
            const filtered = current.filter(r => r.id !== recipe.id)
            const updated = [recipe, ...filtered].slice(0, MAX_ITEMS)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch { }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
        } catch { }
    },
}