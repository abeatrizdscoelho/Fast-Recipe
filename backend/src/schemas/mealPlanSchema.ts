import * as yup from 'yup'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

export const addEntrySchema = yup.object({
    recipeId: yup.string().uuid('ID de receita inválido').required('recipeId obrigatório'),
    dayOfWeek: yup
        .number()
        .integer()
        .min(0, 'dayOfWeek deve ser entre 0 e 6')
        .max(6, 'dayOfWeek deve ser entre 0 e 6')
        .required('dayOfWeek obrigatório'),
    mealType: yup
        .mixed<typeof MEAL_TYPES[number]>()
        .oneOf([...MEAL_TYPES], 'mealType inválido. Use: breakfast, lunch ou dinner')
        .required('mealType obrigatório'),
})

export const replaceEntrySchema = yup.object({
    recipeId: yup.string().uuid('ID de receita inválido').required('recipeId obrigatório'),
})

export type AddEntryInput = yup.InferType<typeof addEntrySchema>
export type ReplaceEntryInput = yup.InferType<typeof replaceEntrySchema>