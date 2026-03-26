import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
  SafeAreaView, Image, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import FieldError from '../components/FieldError';
import { fonts } from '../theme/typography';
import { ValidationError } from 'yup';
import { forgotPasswordValidation } from '../validations/authValidation';
import { authService } from '../services/authService';
import { colors } from '../theme/color';

export default function ForgotPasswordScreen() {
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
          <Text style={styles.title}>RECUPERE SUA SENHA</Text>
          <Text style={styles.subtitle}>Enviaremos um e-mail para a troca de senha.</Text>

          {success ? (
            <Text style={styles.successText}>
              E-mail enviado! Verifique sua caixa de entrada.
            </Text>
          ) : (
            <>
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
                <Text style={styles.label}>Confirme seu Email</Text>
                <TextInput
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, errors.confirmEmail ? styles.inputError : null]}
                />
                <FieldError message={errors.confirmEmail} />
              </View>

              {apiError ? <FieldError message={apiError} /> : null}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleForgotPassword}
                disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'ENVIANDO...' : 'ENVIAR'}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
            <Text style={styles.backText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  inputError: { borderBottomColor: colors.error },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontWeight: 'bold', letterSpacing: 2, fontSize: 15, fontFamily: fonts.bold },
  backWrapper: { alignItems: 'center' },
  backText: { color: colors.primary, fontSize: 13, fontFamily: fonts.regular },
})