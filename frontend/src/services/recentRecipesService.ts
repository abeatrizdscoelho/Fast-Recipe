import AsyncStorage from '@react-native-async-storage/async-storage'
import { FeedRecipe, Recipe } from '../types/recipe'
import crashlytics from '@react-native-firebase/crashlytics'

const STORAGE_KEY = '@recent_recipes'
const MAX_ITEMS = 20

export const recentRecipesService = {
    async getAll(): Promise<Recipe[]> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : []
        } catch (err) {
            crashlytics().log('Erro ao ler receitas recentes do AsyncStorage')
            crashlytics().recordError(err instanceof Error ? err : new Error('Erro desconhecido ao ler AsyncStorage'))
            return []
        }
    },

    async add(recipe: FeedRecipe): Promise<void> {
        try {
            const current = await recentRecipesService.getAll()
            const filtered = current.filter(r => r.id !== recipe.id)
            const updated = [recipe, ...filtered].slice(0, MAX_ITEMS)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch (err) {
            crashlytics().log(`Erro ao salvar receita recente: ${recipe.id}`)
            crashlytics().recordError(err instanceof Error ? err : new Error('Erro ao salvar no AsyncStorage'))
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
        } catch (err) {
            crashlytics().log('Erro ao limpar receitas recentes')
            crashlytics().recordError(err instanceof Error ? err : new Error('Erro ao remover do AsyncStorage'))
        }
    },
}