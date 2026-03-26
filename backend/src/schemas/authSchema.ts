import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 caracteres').required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
})

export const loginSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  confirmEmail: yup.string()
    .email('E-mail inválido')
    .oneOf([yup.ref('email')], 'Os e-mails não coincidem')
    .required('Confirmação de e-mail obrigatória'),
})

export const resetPasswordSchema = yup.object({
  token: yup.string().required('Token obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação de senha obrigatória'),
})

export type RegisterInput = yup.InferType<typeof registerSchema>
export type LoginInput = yup.InferType<typeof loginSchema>
export type ForgotPasswordInput = yup.InferType<typeof forgotPasswordSchema>
export type ResetPasswordInput = yup.InferType<typeof resetPasswordSchema>