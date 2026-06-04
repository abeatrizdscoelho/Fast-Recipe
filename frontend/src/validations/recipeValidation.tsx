import * as yup from 'yup'
import i18next from 'i18next'

export const recipeValidation = yup.object({
  title: yup
    .string()
    .min(2, () => i18next.t('recipeValidation.titleMin'))
    .required(() => i18next.t('recipeValidation.titleRequired')),
  ingredients: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(() => i18next.t('recipeValidation.ingredientNameRequired')),
        quantity: yup
          .number()
          .typeError(() => i18next.t('recipeValidation.ingredientQuantityTypeError'))
          .positive(() => i18next.t('recipeValidation.ingredientQuantityPositive'))
          .required(() => i18next.t('recipeValidation.ingredientQuantityRequired')),
        unit: yup.string().required(() => i18next.t('recipeValidation.ingredientUnitRequired')),
        category: yup.string().default('Outros'),
      })
    )
    .min(1, () => i18next.t('recipeValidation.ingredientsMin'))
    .required(() => i18next.t('recipeValidation.ingredientsRequired')),
  preparation: yup
    .string()
    .min(5, () => i18next.t('recipeValidation.preparationMin'))
    .required(() => i18next.t('recipeValidation.preparationRequired')),
  time: yup.string().required(() => i18next.t('recipeValidation.timeRequired')),
  portions: yup.string().required(() => i18next.t('recipeValidation.portionsRequired')),
  category: yup.string().required(() => i18next.t('recipeValidation.categoryRequired')),
  dietaryRestrictions: yup
    .array()
    .of(yup.string().required())
    .optional()
    .default([]),
  photos: yup
    .array()
    .of(yup.string().required())
    .min(1, () => i18next.t('recipeValidation.photosMin'))
    .required(() => i18next.t('recipeValidation.photosRequired')),
  difficulty: yup.string().required(() => i18next.t('recipeValidation.difficultyRequired')),
  description: yup.string().optional(),
})

export type CreateRecipeFormValues = yup.InferType<typeof recipeValidation>