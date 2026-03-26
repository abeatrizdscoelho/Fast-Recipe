import * as yup from 'yup';

export const editProfileValidation = yup.object({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: yup.string().email('E-mail inválido').optional(),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .optional()
    .transform(val => val === '' ? undefined : val),
  confirmPassword: yup
    .string()
    .optional()
    .transform(val => val === '' ? undefined : val)
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: schema =>
        schema
          .required('Confirmação de senha obrigatória')
          .oneOf([yup.ref('password')], 'As senhas não coincidem'),
    }),
})

export type EditProfileFormData = yup.InferType<typeof editProfileValidation>