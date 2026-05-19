import * as yup from 'yup'

export const PANTRY_CATEGORIES = [
  'Bebidas', 'Carnes e Ovos', 'Congelados', 'Doces', 'Enlatados', 'Frutas e Verduras', 'Hortifruti', 'Laticínios', 'Padaria', 'Grãos e Cereais', 'Massas', 'Temperos', 'Outros',
] as const

export const createPantryItemSchema = yup.object({
  name: yup
    .string()
    .min(1, 'Nome obrigatório')
    .required('Nome é obrigatório'),
  quantity: yup
    .number()
    .typeError('Quantidade deve ser um número')
    .positive('Quantidade deve ser maior que zero')
    .required('Quantidade é obrigatória'),
  unit: yup
    .string()
    .required('Unidade é obrigatória'),
  category: yup
    .string()
    .oneOf([...PANTRY_CATEGORIES], 'Categoria inválida')
    .default('Outros'),
  expiresAt: yup
    .string()
    .nullable()
    .optional()
    .test('is-valid-date', 'Data de validade inválida', value => {
      if (!value) return true
      return !isNaN(Date.parse(value))
    }),
})

export const updatePantryItemSchema = yup.object({
  name: yup
    .string()
    .min(1, 'Nome obrigatório')
    .optional(),
  quantity: yup
    .number()
    .typeError('Quantidade deve ser um número')
    .positive('Quantidade deve ser maior que zero')
    .optional(),
  unit: yup
    .string()
    .optional(),
  category: yup
    .string()
    .oneOf([...PANTRY_CATEGORIES], 'Categoria inválida')
    .optional(),
  expiresAt: yup
    .string()
    .nullable()
    .optional()
    .test('is-valid-date', 'Data de validade inválida', value => {
      if (!value) return true
      return !isNaN(Date.parse(value))
    }),
})

export type CreatePantryItemInput = yup.InferType<typeof createPantryItemSchema>
export type UpdatePantryItemInput = yup.InferType<typeof updatePantryItemSchema>