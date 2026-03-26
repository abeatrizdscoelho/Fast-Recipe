import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
  SafeAreaView, Image, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router, useLocalSearchParams } from 'expo-router';
import EyeIcon from '../components/EyeIcon';
import FieldError from '../components/FieldError';
import { fonts } from '../theme/typography';
import { ValidationError } from 'yup';
import { resetPasswordValidation } from '../validations/authValidation';
import { authService } from '../services/authService';
import { colors } from '../theme/color';

export default function ResetPasswordScreen() {
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
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>NOVA SENHA</Text>
          <Text style={styles.subtitle}>Digite e confirme sua nova senha.</Text>

          {success ? (
            <>
              <Text style={styles.successText}>Senha redefinida com sucesso!</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.buttonText}>IR PARA O LOGIN</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova senha</Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirme a nova senha</Text>
                <View style={[styles.passwordRow, errors.confirmPassword ? styles.passwordRowError : null]}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.inputNoBorder, styles.flex]}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <EyeIcon visible={showConfirmPassword} />
                  </TouchableOpacity>
                </View>
                <FieldError message={errors.confirmPassword} />
              </View>

              {apiError ? <FieldError message={apiError} /> : null}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                style={styles.backWrapper}>
                <Text style={styles.backText}>Voltar para o login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
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
  title: { color: colors.primary, fontSize: 22, fontFamily: fonts.bold, marginBottom: 6 },
  subtitle: { color: colors.gray, fontSize: 13, fontFamily: fonts.regular, marginBottom: 32 },
  successText: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: { marginBottom: 24 },
  label: { color: colors.gray, marginBottom: 4, fontSize: 14, fontFamily: fonts.regular },
  inputNoBorder: {
    paddingBottom: 8,
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.regular,
  },
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
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  backWrapper: { alignItems: 'center' },
  backText: { color: colors.primary, fontSize: 13, fontFamily: fonts.regular },
})