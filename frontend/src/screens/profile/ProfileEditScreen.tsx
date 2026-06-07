import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image, Platform, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FieldError from '../../components/FieldError';
import EyeIcon from '../../components/icons/EyeIcon';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { useEditProfile } from '../../hooks/profile/useProfileEdit';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function EditProfileScreen() {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const {
        user, name, setName, email, setEmail, password, setPassword,
        confirmPassword, setConfirmPassword, showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword, editingField, setEditingField,
        loading, avatarUri, dietaryPreferences, errors, apiError,
        togglePreference, handlePickAvatar, handleSave, dietaryOptions
    } = useEditProfile()

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        card: { backgroundColor: theme.card },
        title: { color: theme.textPrimary },
        avatar: { borderColor: theme.primary, backgroundColor: theme.surfaceSecondary },
        avatarEditBadge: { backgroundColor: theme.primary },
        label: { color: theme.textPrimary },
        inputRow: { borderBottomColor: theme.border },
        input: { color: theme.textMuted },
        inputActive: { color: theme.textPrimary },
        chip: { borderColor: theme.border },
        chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        chipText: { color: theme.textPrimary },
        button: { backgroundColor: theme.primary },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                extraScrollHeight={32}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.card, dynStyles.card]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.title, dynStyles.title]}>{user?.name ?? t('editProfile.fallbackName')}</Text>
                        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backBtn}>
                            <Ionicons name="arrow-undo-outline" size={22} color={theme.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickAvatar}>
                        {avatarUri ? (
                            <Image
                                source={{ uri: avatarUri }}
                                style={[styles.avatar, dynStyles.avatar, { overflow: 'hidden' }]}
                            />
                        ) : (
                            <View style={[styles.avatar, dynStyles.avatar]}>
                                <Ionicons name="person-outline" size={48} color={theme.primary} />
                            </View>
                        )}
                        <View style={[styles.avatarEditBadge, dynStyles.avatarEditBadge]}>
                            <Ionicons name="camera-outline" size={14} color={theme.white} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynStyles.label]}>{t('editProfile.labelName')}</Text>
                        <View style={[styles.inputRow, dynStyles.inputRow]}>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                editable={editingField === 'name'}
                                style={[
                                    styles.input,
                                    dynStyles.input,
                                    editingField === 'name' && styles.inputActive,
                                    editingField === 'name' && dynStyles.inputActive,
                                ]}
                                placeholderTextColor={theme.textMuted}
                            />
                            <TouchableOpacity
                                onPress={() => setEditingField(editingField === 'name' ? null : 'name')}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={18}
                                    color={editingField === 'name' ? theme.primary : theme.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.name} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynStyles.label]}>{t('editProfile.labelEmail')}</Text>
                        <View style={[styles.inputRow, dynStyles.inputRow]}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={editingField === 'email'}
                                style={[
                                    styles.input,
                                    dynStyles.input,
                                    editingField === 'email' && styles.inputActive,
                                    editingField === 'email' && dynStyles.inputActive,
                                ]}
                                placeholderTextColor={theme.textMuted}
                            />
                            <TouchableOpacity
                                onPress={() => setEditingField(editingField === 'email' ? null : 'email')}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={18}
                                    color={editingField === 'email' ? theme.primary : theme.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.email} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynStyles.label]}>{t('editProfile.labelPassword')}</Text>
                        <View style={[styles.inputRow, dynStyles.inputRow]}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={editingField === 'password'}
                                placeholder="••••••••"
                                style={[
                                    styles.input,
                                    dynStyles.input,
                                    editingField === 'password' && styles.inputActive,
                                    editingField === 'password' && dynStyles.inputActive,
                                ]}
                                placeholderTextColor={theme.textMuted}
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
                                    color={editingField === 'password' ? theme.primary : theme.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldError message={errors.password} />
                    </View>

                    {editingField === 'password' && (
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, dynStyles.label]}>{t('editProfile.labelConfirmPassword')}</Text>
                            <View style={[styles.inputRow, dynStyles.inputRow]}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    placeholder="••••••••"
                                    style={[styles.input, dynStyles.input, styles.inputActive, dynStyles.inputActive]}
                                    placeholderTextColor={theme.textMuted}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <EyeIcon visible={showConfirmPassword} />
                                </TouchableOpacity>
                            </View>
                            <FieldError message={errors.confirmPassword} />
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynStyles.label]}>{t('editProfile.labelDietary')}</Text>
                        <Text style={styles.labelHint}>{t('editProfile.dietaryHint')}</Text>
                        <View style={styles.chipsContainer}>
                            {dietaryOptions.map((pref: { key: string; label: string }) => {
                                const isSelected = dietaryPreferences.includes(pref.key)
                                return (
                                    <TouchableOpacity
                                        key={pref.key}
                                        style={[styles.chip, dynStyles.chip, isSelected && styles.chipActive, isSelected && dynStyles.chipActive]}
                                        onPress={() => togglePreference(pref.key)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={13} color={theme.white} />}
                                        <Text style={[styles.chipText, dynStyles.chipText, isSelected && styles.chipTextActive]}>
                                            {pref.label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    {apiError ? <FieldError message={apiError} centered={true} /> : null}

                    <TouchableOpacity
                        style={[styles.button, dynStyles.button, loading && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? t('editProfile.saving') : t('editProfile.save')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7A0000',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
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
        color: '#7A0000',
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
        borderColor: '#7A0000',
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
        backgroundColor: '#7A0000',
        borderRadius: 12,
        padding: 4,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#7A0000',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    labelHint: {
        color: '#9CA3AF',
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
        color: '#9CA3AF',
        paddingVertical: 0,
    },
    inputActive: {
        color: '#7A0000',
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
        backgroundColor: '#7A0000',
        borderColor: '#7A0000',
    },
    chipText: {
        fontSize: 13,
        color: '#7A0000',
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#7A0000',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 15,
    },
})