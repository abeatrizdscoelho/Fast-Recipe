import React from 'react';
import { Image, Platform, SafeAreaView, StyleSheet,
    Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FieldError from '../../components/FieldError';
import { useForgotPassword } from '../../hooks/auth/useForgotPassword';
import { colors } from '../../theme/color';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const {
    email, setEmail, confirmEmail, setConfirmEmail,
    loading, errors, apiError, success,
    handleForgotPassword, navigation
  } = useForgotPassword()

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
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>

          {success ? (
            <Text style={styles.successText}>
              {t('auth.forgotPassword.successMessage')}
            </Text>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.forgotPassword.labelEmail')}</Text>
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
                <Text style={styles.label}>{t('auth.forgotPassword.labelConfirmEmail')}</Text>
                <TextInput
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, errors.confirmEmail ? styles.inputError : null]}
                />
                <FieldError message={errors.confirmEmail} />
              </View>

              {apiError ? <FieldError message={apiError} centered={true} /> : null}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleForgotPassword}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? t('auth.forgotPassword.loadingBtn') : t('auth.forgotPassword.submitBtn')}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
            <Text style={styles.backText}>{t('auth.forgotPassword.backToLogin')}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.primary 
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
    color: colors.primary, 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 6 
  },
  subtitle: { 
    color: colors.gray, 
    fontSize: 13, 
    marginBottom: 32 
  },
  successText: {
    color: colors.primary,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: { 
    marginBottom: 24 
  },
  label: { 
    color: colors.gray, 
    marginBottom: 4, 
    fontSize: 14 
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    fontSize: 16,
    color: colors.black,
  },
  inputError: { 
    borderBottomColor: colors.error 
  },
  button: {
    backgroundColor: colors.primary,
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
    fontSize: 15 
  },
  backWrapper: { 
    alignItems: 'center' 
  },
  backText: { 
    color: colors.primary, 
    fontSize: 13 
  },
})