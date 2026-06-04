import { useTranslation } from 'react-i18next'

export function useAppConstants() {
    const { t } = useTranslation()

    const CATEGORIES = [
        { key: 'breakfast', label: t('categories.breakfast') },
        { key: 'lunch', label: t('categories.lunch') },
        { key: 'dinner', label: t('categories.dinner') },
        { key: 'snack', label: t('categories.snack') },
        { key: 'dessert', label: t('categories.dessert') },
        { key: 'drink', label: t('categories.drink') },
    ]

    const DIETARY_RESTRICTIONS = [
        { key: 'vegetarian', label: t('dietaryRestrictions.vegetarian') },
        { key: 'vegan', label: t('dietaryRestrictions.vegan') },
        { key: 'glutenFree', label: t('dietaryRestrictions.glutenFree') },
        { key: 'lactoseFree', label: t('dietaryRestrictions.lactoseFree') },
        { key: 'sugarFree', label: t('dietaryRestrictions.sugarFree') },
        { key: 'lowCarb', label: t('dietaryRestrictions.lowCarb') },
        { key: 'ketogenic', label: t('dietaryRestrictions.ketogenic') },
    ]

    const DIFFICULTIES = [
        { key: 'easy', label: t('difficulties.easy') },
        { key: 'medium', label: t('difficulties.medium') },
        { key: 'hard', label: t('difficulties.hard') },
    ]

    const INGREDIENT_CATEGORIES = [
        { key: 'drinks', label: t('ingredientCategories.drinks') },
        { key: 'meatAndEggs', label: t('ingredientCategories.meatAndEggs') },
        { key: 'frozen', label: t('ingredientCategories.frozen') },
        { key: 'sweets', label: t('ingredientCategories.sweets') },
        { key: 'canned', label: t('ingredientCategories.canned') },
        { key: 'fruitsAndVegetables', label: t('ingredientCategories.fruitsAndVegetables') },
        { key: 'produce', label: t('ingredientCategories.produce') },
        { key: 'dairy', label: t('ingredientCategories.dairy') },
        { key: 'bakery', label: t('ingredientCategories.bakery') },
        { key: 'grainsAndCereals', label: t('ingredientCategories.grainsAndCereals') },
        { key: 'pasta', label: t('ingredientCategories.pasta') },
        { key: 'spices', label: t('ingredientCategories.spices') },
        { key: 'others', label: t('ingredientCategories.others') },
    ]

    const INGREDIENT_UNITS = [
        { key: 'gram', label: t('ingredientUnits.gram', { count: 1 }) },
        { key: 'kilogram', label: t('ingredientUnits.kilogram', { count: 1 }) },
        { key: 'milliliter', label: t('ingredientUnits.milliliter', { count: 1 }) },
        { key: 'liter', label: t('ingredientUnits.liter', { count: 1 }) },
        { key: 'unit', label: t('ingredientUnits.unit', { count: 1 }) },
        { key: 'cup', label: t('ingredientUnits.cup', { count: 1 }) },
        { key: 'teaspoon', label: t('ingredientUnits.teaspoon', { count: 1 }) },
        { key: 'tablespoon', label: t('ingredientUnits.tablespoon', { count: 1 }) },
    ]

    const DAY_LABELS = [
        t('dayLabels.mon'), t('dayLabels.tue'), t('dayLabels.wed'),
        t('dayLabels.thu'), t('dayLabels.fri'), t('dayLabels.sat'), t('dayLabels.sun'),
    ]

    const MONTH_NAMES = [
        t('monthNames.january'), t('monthNames.february'), t('monthNames.march'),
        t('monthNames.april'), t('monthNames.may'), t('monthNames.june'),
        t('monthNames.july'), t('monthNames.august'), t('monthNames.september'),
        t('monthNames.october'), t('monthNames.november'), t('monthNames.december'),
    ]

    return {
        CATEGORIES,
        DIETARY_RESTRICTIONS,
        DIFFICULTIES,
        INGREDIENT_CATEGORIES,
        INGREDIENT_UNITS,
        DAY_LABELS,
        MONTH_NAMES,
    }
}