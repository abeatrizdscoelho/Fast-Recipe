import * as yup from 'yup';
import i18next from 'i18next';

export const editProfileValidation = yup.object({
  name: yup.string()
    .min(2, () => i18next.t('auth.validation.nameMin'))
    .optional(),
  email: yup.string()
    .email(() => i18next.t('auth.validation.emailInvalid'))
    .optional(),
  password: yup.string()
    .min(6, () => i18next.t('auth.validation.passwordMin'))
    .optional()
    .transform(val => val === '' ? undefined : val),
  confirmPassword: yup.string()
    .optional()
    .transform(val => val === '' ? undefined : val)
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: schema =>
        schema
          .required(() => i18next.t('auth.validation.confirmPasswordRequired'))
          .oneOf([yup.ref('password')], () => i18next.t('auth.validation.passwordsMustMatch')),
    }),
  dietaryPreferences: yup.array().of(yup.string()).optional(),
})

export type EditProfileFormData = yup.InferType<typeof editProfileValidation>