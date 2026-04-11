import { useState } from 'react';
import { ValidationError } from 'yup';
import { useAuth } from '../../context/AuthContext';
import { registerValidation } from '../../validations/authValidation';
import { router } from 'expo-router';

export function useRegister() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [apiError, setApiError] = useState('')

  async function handleRegister() {
    try {
      setApiError('')
      await registerValidation.validate({ name, email, password }, { abortEarly: false })
      setErrors({})
      setLoading(true)
      await register(name, email, password)
      router.replace('/(auth)/login')
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: { name?: string; email?: string; password?: string } = {}
        err.inner.forEach(e => {
          if (e.path === 'name') fieldErrors.name = e.message
          if (e.path === 'email') fieldErrors.email = e.message
          if (e.path === 'password') fieldErrors.password = e.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(err instanceof Error ? err.message : 'Erro ao cadastrar')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    loading, errors, apiError,
    handleRegister
  }
}