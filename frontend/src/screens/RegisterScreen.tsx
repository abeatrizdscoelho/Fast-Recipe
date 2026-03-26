import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ValidationError } from 'yup';
import FieldError from '../components/FieldError';
import EyeIcon from '../components/icons/EyeIcon';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/color';
import { fonts } from '../theme/typography';
import { registerValidation } from '../validations/authValidation';

export default function RegisterScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.logoArea}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>CADASTRO</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={[styles.input, errors.name ? styles.inputError : null]}
            />
            <FieldError message={errors.name} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errors.email ? styles.inputError : null]}
            />
            <FieldError message={errors.email} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.passwordRow, errors.password ? styles.passwordRowError : null]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.inputNoBorder, styles.flex]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
            <FieldError message={errors.password} />
          </View>

          {apiError ? <FieldError message={apiError} /> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'CADASTRANDO...' : 'CADASTRAR'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginWrapper}>
            <Text style={styles.loginText}>
              Já tem uma conta?{' '}
              <Text style={styles.loginBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.primary },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: { width: 200, height: 200 },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 36,
    paddingBottom: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: { color: colors.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  inputGroup: { marginBottom: 24 },
  label: { color: colors.gray, marginBottom: 4, fontSize: 14, fontFamily: fonts.regular },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  inputError: { borderBottomColor: colors.error },
  inputNoBorder: { paddingBottom: 8, fontSize: 16, color: colors.black, fontFamily: fonts.regular },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  passwordRowError: { borderBottomColor: colors.error },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontWeight: 'bold', letterSpacing: 2, fontSize: 15 },
  loginWrapper: { alignItems: 'center' },
  loginText: { color: colors.primary, fontSize: 13, fontFamily: fonts.regular },
  loginBold: { fontWeight: 'bold', },
})