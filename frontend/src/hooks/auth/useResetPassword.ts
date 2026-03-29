import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ValidationError } from 'yup';
import { resetPasswordValidation } from '../../validations/authValidation';
import { authService } from '../../services/authService';

export function useResetPassword() {
  const { token } = useLocalSearchParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleResetPassword() {
    try {
      setApiError('')
      await resetPasswordValidation.validate({ password, confirmPassword }, { abortEarly: false })
      setErrors({})
      setLoading(true)
      await authService.resetPassword(token, password, confirmPassword)
      setSuccess(true)
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: { password?: string; confirmPassword?: string } = {}
        err.inner.forEach(e => {
          if (e.path === 'password') fieldErrors.password = e.message
          if (e.path === 'confirmPassword') fieldErrors.confirmPassword = e.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(err instanceof Error ? err.message : 'Erro ao redefinir senha')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    loading, errors, apiError, success,
    handleResetPassword
  }
}