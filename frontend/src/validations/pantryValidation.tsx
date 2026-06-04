import * as yup from 'yup'
import i18next from 'i18next'

export const PANTRY_CATEGORIES = [
  'drinks', 'meatAndEggs', 'frozen', 'sweets', 'canned', 'fruitsAndVegetables', 'produce',
  'dairy', 'bakery', 'grainsAndCereals', 'pasta', 'spices', 'others'
] as const

export const addPantryItemValidation = yup.object({
  name: yup
    .string()
    .min(1, () => i18next.t('pantry.validation.nameRequired'))
    .required(() => i18next.t('pantry.validation.nameRequired')),
  quantity: yup
    .number()
    .typeError(() => i18next.t('pantry.validation.quantityTypeError'))
    .positive(() => i18next.t('pantry.validation.quantityPositive'))
    .required(() => i18next.t('pantry.validation.quantityInvalid')),
  unit: yup
    .string()
    .required(() => i18next.t('pantry.validation.unitRequired')),
  category: yup
    .string()
    .oneOf([...PANTRY_CATEGORIES], () => i18next.t('pantry.validation.categoryInvalid'))
    .default('others'), 
  expiresAt: yup
    .string()
    .nullable()
    .optional()
    .test('is-valid-date', () => i18next.t('pantry.validation.dateInvalid'), value => {
      if (!value) return true
      return !isNaN(Date.parse(value))
    }),
})

export const updatePantryItemValidation = yup.object({
  name: yup
    .string()
    .min(1, () => i18next.t('pantry.validation.nameRequired'))
    .optional(),
  quantity: yup
    .number()
    .typeError(() => i18next.t('pantry.validation.quantityTypeError'))
    .positive(() => i18next.t('pantry.validation.quantityPositive'))
    .optional(),
  unit: yup
    .string()
    .optional(),
  category: yup
    .string()
    .oneOf([...PANTRY_CATEGORIES], () => i18next.t('pantry.validation.categoryInvalid'))
    .optional(),
  expiresAt: yup
    .string()
    .nullable()
    .optional()
    .test('is-valid-date', () => i18next.t('pantry.validation.dateInvalid'), value => {
      if (!value) return true
      return !isNaN(Date.parse(value))
    }),
})

export type AddPantryItemFormValues = yup.InferType<typeof addPantryItemValidation>
export type UpdatePantryItemFormValues = yup.InferType<typeof updatePantryItemValidation>