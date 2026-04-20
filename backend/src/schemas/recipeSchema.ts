import * as yup from 'yup'

export const createRecipeSchema = yup.object({
  title: yup.string().min(2, 'Título deve ter pelo menos 2 caracteres').required('Título obrigatório'),
  ingredients: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Informe pelo menos um ingrediente')
    .required('Ingredientes obrigatórios')
    .transform((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return val }
      }
      return val
    }),
  preparation: yup.string().min(5, 'Modo de preparo muito curto').required('Modo de preparo obrigatório'),
  time: yup.string().required('Tempo de preparo obrigatório'),
  portions: yup.string().required('Porções obrigatórias'),
  category: yup.string().required('Categoria obrigatória'),
  difficulty: yup.string().required('Dificuldade obrigatória'),
  description: yup.string().optional(),
  dietaryRestrictions: yup
    .array()
    .of(yup.string().required()).optional()
    .default([])
    .transform((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return val }
      }
      return val
    }),
})

export const updateRecipeSchema = yup.object({
  title: yup.string().min(2).optional(),
  ingredients: yup
    .array()
    .of(yup.string().required())
    .optional()
    .transform((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return val }
      }
      return val
    }),
  preparation: yup.string().min(5).optional(),
  time: yup.string().optional(),
  portions: yup.string().optional(),
  category: yup.string().optional(),
  difficulty: yup.string().optional(),
  description: yup.string().optional(),
  dietaryRestrictions: yup
    .array()
    .of(yup.string().required()).optional()
    .transform((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return val }
      }
      return val
    }),
})

export type CreateRecipeInput = yup.InferType<typeof createRecipeSchema>
export type UpdateRecipeInput = yup.InferType<typeof updateRecipeSchema>