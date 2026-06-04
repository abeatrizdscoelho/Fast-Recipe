import * as yup from 'yup';
import i18next from 'i18next';

export const loginValidation = yup.object({
  email: yup.string()
    .email(() => i18next.t('validation.emailInvalid'))
    .required(() => i18next.t('validation.emailRequired')),
  password: yup.string()
    .min(6, () => i18next.t('validation.passwordMin'))
    .required(() => i18next.t('validation.passwordRequired')),
})

export const registerValidation = yup.object({
  name: yup.string()
    .min(2, () => i18next.t('validation.nameMin'))
    .required(() => i18next.t('validation.nameRequired')),
  email: yup.string()
    .email(() => i18next.t('validation.emailInvalid'))
    .required(() => i18next.t('validation.emailRequired')),
  password: yup.string()
    .min(6, () => i18next.t('validation.passwordMin'))
    .required(() => i18next.t('validation.passwordRequired')),
})

export const forgotPasswordValidation = yup.object({
  email: yup.string()
    .email(() => i18next.t('validation.emailInvalid'))
    .required(() => i18next.t('validation.emailRequired')),
  confirmEmail: yup.string()
    .email(() => i18next.t('validation.emailInvalid'))
    .oneOf([yup.ref('email')], () => i18next.t('validation.emailsMustMatch'))
    .required(() => i18next.t('validation.confirmEmailRequired')),
})

export const resetPasswordValidation = yup.object({
  password: yup.string()
    .min(6, () => i18next.t('validation.passwordMin'))
    .required(() => i18next.t('validation.passwordRequired')),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], () => i18next.t('validation.passwordsMustMatch'))
    .required(() => i18next.t('validation.confirmPasswordRequired')),
})

export type LoginFormData = yup.InferType<typeof loginValidation>
export type RegisterFormData = yup.InferType<typeof registerValidation>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordValidation>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordValidation>