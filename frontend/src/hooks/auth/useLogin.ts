import { useState } from 'react';
import { router } from 'expo-router';
import { ValidationError } from 'yup';
import { useAuth } from '../../context/AuthContext';
import { loginValidation } from '../../validations/authValidation';

export function useLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState('')

  async function handleLogin() {
    try {
      setApiError('')
      await loginValidation.validate({ email, password }, { abortEarly: false })
      setErrors({})
      setLoading(true)
      await login(email, password)
      router.replace('/onboarding')
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: { email?: string; password?: string } = {}
        err.inner.forEach(e => {
          if (e.path === 'email') fieldErrors.email = e.message
          if (e.path === 'password') fieldErrors.password = e.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(err instanceof Error ? err.message : 'Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    errors,
    apiError,
    handleLogin,
  }
}