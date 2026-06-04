import AsyncStorage from '@react-native-async-storage/async-storage'
import { Recipe } from '../types/recipe'

const KEY = '@favorite_recipes'

export const favoritesStorage = {
  async getAll(): Promise<Recipe[]> {
    const json = await AsyncStorage.getItem(KEY)
    return json ? JSON.parse(json) : []
  },

  async save(recipe: Recipe): Promise<void> {
    const current = await this.getAll()
    const updated = [...current.filter(r => r.id !== recipe.id), recipe]
    await AsyncStorage.setItem(KEY, JSON.stringify(updated))
  },

  async saveMany(recipes: Recipe[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(recipes))
  },

  async remove(recipeId: string): Promise<void> {
    const current = await this.getAll()
    const updated = current.filter(r => r.id !== recipeId)
    await AsyncStorage.setItem(KEY, JSON.stringify(updated))
  },
}