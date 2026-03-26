import * as yup from 'yup';

export const loginValidation = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
})

export const registerValidation = yup.object({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 caracteres').required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
})

export const forgotPasswordValidation = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  confirmEmail: yup.string()
    .email('E-mail inválido')
    .oneOf([yup.ref('email')], 'Os e-mails não coincidem')
    .required('Confirmação de e-mail obrigatória'),
})

export const resetPasswordValidation = yup.object({
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação de senha obrigatória'),
})

export type LoginFormData = yup.InferType<typeof loginValidation>
export type RegisterFormData = yup.InferType<typeof registerValidation>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordValidation>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordValidation>