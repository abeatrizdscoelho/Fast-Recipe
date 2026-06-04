import axios from 'axios'

const USDA_API_KEY = process.env.USDA_API_KEY
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
}

interface USDAFoodNutrient {
  nutrientId: number
  nutrientName: string
  value: number
  unitName: string
}

interface USDAFood {
  fdcId: number
  description: string
  foodNutrients: USDAFoodNutrient[]
  servingSize?: number
  servingSizeUnit?: string
}

// IDs dos nutrientes na USDA
const NUTRIENT_IDS = {
  calories: 1008,
  protein: 1003,
  carbs: 1005,
  fat: 1004,
  fiber: 1079,
  sodium: 1093,
}

const translationCache: Record<string, string> = {}
async function translateToEnglish(text: string): Promise<string> {
  const key = text.toLowerCase().trim()

  if (translationCache[key]) return translationCache[key]

  try {
    const { data } = await axios.get(MYMEMORY_URL, {
      params: {
        q: key,
        langpair: 'pt|en',
      },
      timeout: 5000,
    })

    const translated: string =
      data.responseStatus === 200 && data.responseData?.translatedText
        ? data.responseData.translatedText.trim()
        : key

    translationCache[key] = translated
    return translated
  } catch {
    translationCache[key] = key
    return key
  }
}

async function searchFood(ingredientName: string): Promise<USDAFood | null> {
  const translatedName = await translateToEnglish(ingredientName)

  try {
    const { data } = await axios.get(`${USDA_BASE_URL}/foods/search`, {
      params: {
        query: translatedName,
        api_key: USDA_API_KEY,
        pageSize: 1,
        dataType: 'Foundation,SR Legacy',
      },
      timeout: 5000,
    })

    return data.foods?.[0] ?? null
  } catch {
    return null
  }
}

function extractNutrient(food: USDAFood, nutrientId: number): number {
  return food.foodNutrients.find((n) => n.nutrientId === nutrientId)?.value ?? 0
}

function toGrams(quantity: number, unit: string, food?: USDAFood): number {
  const u = unit.toLowerCase().trim()

  const wholeUnitAliases = ['unit', 'units', 'unidade', 'unidades', 'un', 'und', 'unid']
  if (wholeUnitAliases.includes(u)) {
    const servingGrams =
      food?.servingSize && food.servingSizeUnit?.toLowerCase() === 'g'
        ? food.servingSize
        : 100
    return servingGrams * quantity
  }

  const conversions: Record<string, number> = {
    'kg': 1000, 'kilogram': 1000, 'kilograms': 1000,
    'g': 1, 'gram': 1, 'grams': 1,
    'l': 1000, 'liter': 1000, 'liters': 1000,
    'ml': 1, 'milliliter': 1, 'milliliters': 1,
    'cup': 240,
    'tbsp': 15, 'tablespoon': 15, 'tablespoons': 15,
    'tsp': 5, 'teaspoon': 5, 'teaspoons': 5,

    'quilograma': 1000, 'quilogramas': 1000,
    'grama': 1, 'gramas': 1,
    'litro': 1000, 'litros': 1000,
    'mililitro': 1, 'mililitros': 1,
    'xícara': 240, 'xicara': 240, 'xícaras': 240,
    'colher de sopa': 15, 'colheres de sopa': 15,
    'colher de chá': 5, 'colheres de chá': 5,
    'colher': 15, 'colheres': 15,
    'fatia': 30, 'fatias': 30,
    'pedaço': 80, 'pedaços': 80,
    'pitada': 1, 'pitadas': 1,
    'dente': 5, 'dentes': 5,
  }

  return (conversions[u] ?? 100) * quantity
}

export async function getNutritionForIngredients(
  ingredients: { name: string; quantity: number; unit: string }[]
): Promise<NutritionInfo> {
  const totals: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  }

  await Promise.all(
    ingredients.map(async (ingredient) => {
      const food = await searchFood(ingredient.name)
      if (!food) return

      // A USDA retorna valores por 100g
      const grams = toGrams(ingredient.quantity, ingredient.unit, food)
      const factor = grams / 100

      totals.calories += extractNutrient(food, NUTRIENT_IDS.calories) * factor
      totals.protein += extractNutrient(food, NUTRIENT_IDS.protein) * factor
      totals.carbs += extractNutrient(food, NUTRIENT_IDS.carbs) * factor
      totals.fat += extractNutrient(food, NUTRIENT_IDS.fat) * factor
      totals.fiber += extractNutrient(food, NUTRIENT_IDS.fiber) * factor
      totals.sodium += extractNutrient(food, NUTRIENT_IDS.sodium) * factor
    })
  )

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
    sodium: Math.round(totals.sodium * 10) / 10,
  }
}