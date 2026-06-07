import React from 'react';
import {
  Image, Platform, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FieldError from '../../components/FieldError';
import { useForgotPassword } from '../../hooks/auth/useForgotPassword';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const {
    email, setEmail, confirmEmail, setConfirmEmail,
    loading, errors, apiError, success,
    handleForgotPassword, navigation
  } = useForgotPassword()

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    title: { color: theme.textPrimary },
    successText: { color: theme.textPrimary },
    input: { borderBottomColor: theme.primary, color: theme.textPrimary },
    button: { backgroundColor: theme.primary },
    backText: { color: theme.textPrimary },
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
          <Text style={[styles.title, dynStyles.title]}>{t('forgotPassword.title')}</Text>
          <Text style={styles.subtitle}>{t('forgotPassword.subtitle')}</Text>

          {success ? (
            <Text style={[styles.successText, dynStyles.successText]}>
              {t('forgotPassword.successMessage')}
            </Text>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('forgotPassword.labelEmail')}</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, dynStyles.input, errors.email ? styles.inputError : null]}
                  placeholderTextColor={theme.textMuted}
                />
                <FieldError message={errors.email} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('forgotPassword.labelConfirmEmail')}</Text>
                <TextInput
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, dynStyles.input, errors.confirmEmail ? styles.inputError : null]}
                  placeholderTextColor={theme.textMuted}
                />
                <FieldError message={errors.confirmEmail} />
              </View>

              {apiError ? <FieldError message={apiError} centered={true} /> : null}

              <TouchableOpacity
                style={[styles.button, dynStyles.button, loading && styles.buttonDisabled]}
                onPress={handleForgotPassword}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? t('forgotPassword.loadingBtn') : t('forgotPassword.submitBtn')}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
            <Text style={[styles.backText, dynStyles.backText]}>{t('forgotPassword.backToLogin')}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7A0000',
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
    height: 200,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
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
    color: '#7A0000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 32,
  },
  successText: {
    color: '#7A0000',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#7A0000',
    paddingBottom: 8,
    fontSize: 16,
    color: '#000000',
  },
  inputError: {
    borderBottomColor: '#DC2626',
  },
  button: {
    backgroundColor: '#7A0000',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 15,
  },
  backWrapper: {
    alignItems: 'center',
  },
  backText: {
    color: '#7A0000',
    fontSize: 13,
  },
})