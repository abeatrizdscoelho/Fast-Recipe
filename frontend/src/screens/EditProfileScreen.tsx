import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, Platform, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/color';
import { fonts } from '../theme/typography';
import EyeIcon from '../components/icons/EyeIcon';
import { userService } from '../services/userService';
import { editProfileValidation } from '../validations/userValidation';
import { ValidationError } from 'yup';
import FieldError from '../components/FieldError';

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth()
    const [name, setName] = useState(user?.name ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [editingField, setEditingField] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null)
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
    const [apiError, setApiError] = useState('')

    async function handlePickAvatar() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria.')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })
        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    async function handleSave() {
        try {
            setApiError('')
            await editProfileValidation.validate({ name, email, password, confirmPassword }, { abortEarly: false })
            setErrors({})
            setLoading(true)
            const isNewAvatar = avatarUri && avatarUri !== user?.avatarUrl
            const hasChanges = name !== user?.name || email !== user?.email || !!password || !!isNewAvatar
            if (!hasChanges) {
                Alert.alert('Aviso', 'Nenhuma alteração foi feita.')
                setLoading(false)
                return
            }
            const data = await userService.updateProfile({
                name: name !== user?.name ? name : undefined,
                email: email !== user?.email ? email : undefined,
                password: password || undefined,
                confirmPassword: confirmPassword || undefined,
                avatar: isNewAvatar ? (() => {
                    const filename = avatarUri.split('/').pop() ?? 'avatar.jpg'
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    return { uri: avatarUri, name: filename, type }
                })() : undefined,
            })
            await updateUser(data.user)
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
            router.back()
        } catch (err) {
            if (err instanceof ValidationError) {
                const fieldErrors: typeof errors = {}
                err.inner.forEach(e => {
                    if (e.path === 'name') fieldErrors.name = e.message
                    if (e.path === 'email') fieldErrors.email = e.message
                    if (e.path === 'password') fieldErrors.password = e.message
                    if (e.path === 'confirmPassword') fieldErrors.confirmPassword = e.message
                })
                setErrors(fieldErrors)
            } else {
                setApiError(err instanceof Error ? err.message : 'Não foi possível atualizar o perfil.')
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
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{user?.name ?? 'Usuário'}</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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

                    {apiError ? <FieldError message={apiError} /> : null}

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
        right: '33%',
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
        fontFamily: fonts.regular,
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
        fontFamily: fonts.regular,
        paddingVertical: 0,
    },
    inputActive: {
        color: colors.primary,
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