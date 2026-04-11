import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, StyleSheet,
    Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FieldError from '../../components/FieldError';
import EyeIcon from '../../components/icons/EyeIcon';
import { colors } from '../../theme/color';
import { useEditProfile } from '../../hooks/profile/useProfileEdit';

const DIETARY_OPTIONS = [
    'Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 
    'Sem açúcar', 'Low carb', 'Cetogênico',
]

export default function EditProfileScreen() {
    const {
    user, name, setName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword, editingField, setEditingField,
    loading, avatarUri, dietaryPreferences, errors, apiError,
    togglePreference, handlePickAvatar, handleSave
  } = useEditProfile()

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                extraScrollHeight={32}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{user?.name ?? 'Usuário'}</Text>
                        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backBtn}>
                            <Ionicons name="arrow-undo-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickAvatar}>
                        {avatarUri ? (
                            <Image
                                source={{ uri: avatarUri }}
                                style={[styles.avatar, { overflow: 'hidden' }]}
                            />
                        ) : (
                            <View style={styles.avatar}>
                                <Ionicons name="person-outline" size={48} color={colors.primary} />
                            </View>
                        )}
                        <View style={styles.avatarEditBadge}>
                            <Ionicons name="camera-outline" size={14} color={colors.white} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                editable={editingField === 'name'}
                                style={[
                                    styles.input,
                                    editingField === 'name' && styles.inputActive,
                                ]}
                                placeholderTextColor={colors.gray}
                            />
                            <TouchableOpacity
                                onPress={() => setEditingField(editingField === 'name' ? null : 'name')}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={18}
                                    color={editingField === 'name' ? colors.primary : colors.gray}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.name} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={editingField === 'email'}
                                style={[
                                    styles.input,
                                    editingField === 'email' && styles.inputActive,
                                ]}
                                placeholderTextColor={colors.gray}
                            />
                            <TouchableOpacity
                                onPress={() => setEditingField(editingField === 'email' ? null : 'email')}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={18}
                                    color={editingField === 'email' ? colors.primary : colors.gray}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.email} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={editingField === 'password'}
                                placeholder="••••••••"
                                style={[
                                    styles.input,
                                    editingField === 'password' && styles.inputActive,
                                ]}
                                placeholderTextColor={colors.gray}
                            />
                            {editingField === 'password' && (
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <EyeIcon visible={showPassword} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => setEditingField(editingField === 'password' ? null : 'password')}
                                style={editingField === 'password' ? { marginLeft: 8 } : undefined}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={18}
                                    color={editingField === 'password' ? colors.primary : colors.gray}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.password} />
                    </View>

                    {editingField === 'password' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar Senha</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    placeholder="••••••••"
                                    style={[styles.input, styles.inputActive]}
                                    placeholderTextColor={colors.gray}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <EyeIcon visible={showConfirmPassword} />
                                </TouchableOpacity>
                            </View>
                            <FieldError message={errors.confirmPassword} />
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Preferências Alimentares</Text>
                        <Text style={styles.labelHint}>Toque para selecionar ou remover</Text>
                        <View style={styles.chipsContainer}>
                            {DIETARY_OPTIONS.map(pref => {
                                const isSelected = dietaryPreferences.includes(pref)
                                return (
                                    <TouchableOpacity
                                        key={pref}
                                        style={[styles.chip, isSelected && styles.chipActive]}
                                        onPress={() => togglePreference(pref)}
                                    >
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={13} color={colors.white} />
                                        )}
                                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                            {pref}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    {apiError ? <FieldError message={apiError} centered={true} /> : null}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? 'SALVANDO...' : 'SALVAR'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
            android: { elevation: 6 },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        flexShrink: 1,
        marginRight: 8,
    },
    backBtn: {
        padding: 4,
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f0ee',
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 28,
        position: 'relative',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 4,
    },

    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    labelHint: {
        color: colors.gray,
        fontSize: 12,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0d6d0',
        paddingBottom: 8,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.black,
        paddingVertical: 0,
    },
    inputActive: {
        color: colors.primary,
    },

    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#e0d6d0',
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    chipTextActive: {
        color: colors.white,
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 15,
    },
})