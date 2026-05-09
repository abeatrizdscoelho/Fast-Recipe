import * as yup from 'yup'

export const toggleBoughtSchema = yup.object({
    ingredientIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'ingredientIds deve ter pelo menos um item')
        .required('ingredientIds é obrigatório'),
    bought: yup
        .boolean()
        .required('bought é obrigatório'),
})

export const addItemSchema = yup.object({
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
        .default('Outros'),
})

export const updateItemSchema = yup.object({
    ingredientIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'ingredientIds deve ter pelo menos um item')
        .required('ingredientIds é obrigatório'),
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
        .default('Outros'),
})

export const deleteItemSchema = yup.object({
    ingredientIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'ingredientIds deve ter pelo menos um item')
        .required('ingredientIds é obrigatório'),
})