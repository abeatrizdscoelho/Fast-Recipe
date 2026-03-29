import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useResetPassword } from '../../hooks/auth/useResetPassword';
import EyeIcon from '../../components/icons/EyeIcon';
import FieldError from '../../components/FieldError';
import { colors } from '../../theme/color';

export default function ResetPasswordScreen() {
  const {
    password, setPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    loading, errors, apiError, success, handleResetPassword
  } = useResetPassword()

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

              {apiError ? <FieldError message={apiError} centered={true} /> : null}

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
  title: { color: colors.primary, fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { color: colors.gray, fontSize: 13, marginBottom: 32 },
  successText: {
    color: colors.primary,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: { marginBottom: 24 },
  label: { color: colors.gray, marginBottom: 4, fontSize: 14 },
  inputNoBorder: {
    paddingBottom: 8,
    fontSize: 16,
    color: colors.black,
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
  },
  backWrapper: { alignItems: 'center' },
  backText: { color: colors.primary, fontSize: 13 },
})