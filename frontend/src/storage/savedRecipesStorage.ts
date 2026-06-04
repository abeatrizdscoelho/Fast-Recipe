import AsyncStorage from '@react-native-async-storage/async-storage'
import { FeedRecipe } from '../types/recipe'

const KEY = '@saved_recipes'

export const savedRecipesStorage = {
  async getAll(): Promise<FeedRecipe[]> {
    const json = await AsyncStorage.getItem(KEY)
    return json ? JSON.parse(json) : []
  },

  async getById(id: string): Promise<FeedRecipe | null> {
    const all = await this.getAll()
    return all.find(r => r.id === id) ?? null
  },

  async save(recipe: FeedRecipe): Promise<void> {
    const current = await this.getAll()
    const updated = [...current.filter(r => r.id !== recipe.id), recipe]
    await AsyncStorage.setItem(KEY, JSON.stringify(updated))
  },

  async remove(id: string): Promise<void> {
    const current = await this.getAll()
    await AsyncStorage.setItem(KEY, JSON.stringify(current.filter(r => r.id !== id)))
  },

  async isSaved(id: string): Promise<boolean> {
    const all = await this.getAll()
    return all.some(r => r.id === id)
  },
}