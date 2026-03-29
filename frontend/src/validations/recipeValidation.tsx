import * as yup from 'yup'

export const recipeValidation = yup.object({
  title: yup
    .string()
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .required('Título obrigatório'),
  ingredients: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Informe pelo menos um ingrediente')
    .required('Ingredientes obrigatórios'),
  preparation: yup
    .string()
    .min(5, 'Modo de preparo muito curto')
    .required('Modo de preparo obrigatório'),
  time: yup.string().required('Tempo de preparo obrigatório'),
  portions: yup.string().required('Porções obrigatórias'),
  category: yup.string().required('Categoria obrigatória'),
  photos: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Adicione pelo menos uma foto')
    .required('Foto obrigatória'),
  difficulty: yup.string().required('Dificuldade obrigatória'),
  description: yup.string().optional(),
})

export type CreateRecipeFormValues = yup.InferType<typeof recipeValidation>