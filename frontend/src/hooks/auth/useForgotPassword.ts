import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ValidationError } from 'yup';
import { forgotPasswordValidation } from '../../validations/authValidation';
import { authService } from '../../services/authService';

export function useForgotPassword() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; confirmEmail?: string }>({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleForgotPassword() {
    try {
      setApiError('')
      await forgotPasswordValidation.validate({ email, confirmEmail }, { abortEarly: false })
      setErrors({})
      setLoading(true)
      await authService.forgotPassword(email, confirmEmail)
      setSuccess(true)
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: { email?: string; confirmEmail?: string } = {}
        err.inner.forEach(e => {
          if (e.path === 'email') fieldErrors.email = e.message
          if (e.path === 'confirmEmail') fieldErrors.confirmEmail = e.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(err instanceof Error ? err.message : 'Erro ao enviar e-mail')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    email, setEmail,
    confirmEmail, setConfirmEmail,
    loading, errors,
    apiError, success,
    handleForgotPassword,
    navigation
  }
}