import { router } from 'expo-router';
import React from 'react';
import {
  Image, Platform, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FieldError from '../../components/FieldError';
import EyeIcon from '../../components/icons/EyeIcon';
import { useLogin } from '../../hooks/auth/useLogin';
import { colors } from '../../theme/color';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function LoginScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const {
    email, setEmail, password, setPassword,
    showPassword, setShowPassword, loading,
    errors, apiError, handleLogin
  } = useLogin()

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    title: { color: theme.primary },
    label: { color: theme.textMuted },
    input: { borderBottomColor: theme.primary, color: theme.textPrimary },
    inputNoBorder: { color: theme.textPrimary },
    passwordRow: { borderBottomColor: theme.primary },
    forgotText: { color: theme.textMuted },
    button: { backgroundColor: theme.primary },
    registerText: { color: theme.primary },
  })

  return (
    <SafeAreaView style={[styles.container, dynStyles.container]}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.logoArea}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.card, dynStyles.card]}>
          <Text style={[styles.title, dynStyles.title]}>{t('login.title')}</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, dynStyles.label]}>{t('login.labelEmail')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, dynStyles.input, errors.email ? styles.inputError : null]}
            />
            <FieldError message={errors.email} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, dynStyles.label]}>{t('login.labelPassword')}</Text>
            <View style={[styles.passwordRow, dynStyles.passwordRow, errors.password ? styles.passwordRowError : null]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={theme.textMuted}
                style={[styles.inputNoBorder, dynStyles.inputNoBorder, styles.flex]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
            <FieldError message={errors.password} />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotWrapper}>
            <Text style={[styles.forgotText, dynStyles.forgotText]}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>

          {apiError ? <FieldError message={apiError} centered={true} /> : null}

          <TouchableOpacity
            style={[styles.button, dynStyles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? t('login.loadingBtn') : t('login.submitBtn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerWrapper}>
            <Text style={[styles.registerText, dynStyles.registerText]}>
              {t('login.registerPrompt')}{' '}
              <Text style={styles.registerBold}>{t('login.registerAction')}</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
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
  logo: {
    width: 200,
    height: 200
  },
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32
  },
  inputGroup: {
    marginBottom: 24
  },
  label: {
    marginBottom: 4,
    fontSize: 14
  },
  input: {
    borderBottomWidth: 1,
    paddingBottom: 8,
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: colors.error
  },
  inputNoBorder: {
    paddingBottom: 8,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  passwordRowError: {
    borderBottomColor: colors.error
  },
  forgotWrapper: {
    alignItems: 'flex-end',
    marginBottom: 16
  },
  forgotText: {
    fontSize: 13
  },
  button: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 15
  },
  registerWrapper: {
    alignItems: 'center'
  },
  registerText: {
    fontSize: 13
  },
  registerBold: {
    fontWeight: 'bold',
  },
})