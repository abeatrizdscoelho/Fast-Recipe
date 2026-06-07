import { router } from 'expo-router';
import React from 'react';
import {
  Image, Platform, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useResetPassword } from '../../hooks/auth/useResetPassword';
import EyeIcon from '../../components/icons/EyeIcon';
import FieldError from '../../components/FieldError';
import { colors } from '../../theme/color';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function ResetPasswordScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const {
    password, setPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    loading, errors, apiError, success, handleResetPassword
  } = useResetPassword()

  const dynStyles = StyleSheet.create({
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    title: { color: theme.primary },
    subtitle: { color: theme.textMuted },
    successText: { color: theme.primary },
    label: { color: theme.textMuted },
    inputNoBorder: { color: theme.textPrimary },
    passwordRow: { borderBottomColor: theme.primary },
    button: { backgroundColor: theme.primary },
    backText: { color: theme.primary },
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
          <Text style={[styles.title, dynStyles.title]}>{t('resetPassword.title')}</Text>
          <Text style={[styles.subtitle, dynStyles.subtitle]}>{t('resetPassword.subtitle')}</Text>

          {success ? (
            <>
              <Text style={[styles.successText, dynStyles.successText]}>{t('resetPassword.successMessage')}</Text>
              <TouchableOpacity
                style={[styles.button, dynStyles.button]}
                onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.buttonText}>{t('resetPassword.goToLoginBtn')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynStyles.label]}>{t('resetPassword.labelNewPassword')}</Text>
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

              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynStyles.label]}>{t('resetPassword.labelConfirmPassword')}</Text>
                <View style={[styles.passwordRow, dynStyles.passwordRow, errors.confirmPassword ? styles.passwordRowError : null]}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={theme.textMuted}
                    style={[styles.inputNoBorder, dynStyles.inputNoBorder, styles.flex]}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <EyeIcon visible={showConfirmPassword} />
                  </TouchableOpacity>
                </View>
                <FieldError message={errors.confirmPassword} />
              </View>

              {apiError ? <FieldError message={apiError} centered={true} /> : null}

              <TouchableOpacity
                style={[styles.button, dynStyles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? t('resetPassword.loadingBtn') : t('resetPassword.submitBtn')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                style={styles.backWrapper}>
                <Text style={[styles.backText, dynStyles.backText]}>{t('resetPassword.backToLogin')}</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 32
  },
  successText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: {
    marginBottom: 24
  },
  label: {
    marginBottom: 4,
    fontSize: 14
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
  button: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 15,
  },
  backWrapper: {
    alignItems: 'center'
  },
  backText: {
    fontSize: 13
  },
})