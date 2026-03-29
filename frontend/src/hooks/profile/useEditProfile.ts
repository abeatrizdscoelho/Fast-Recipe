import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ValidationError } from 'yup';
import { useAuth } from '../../context/AuthContext';
import { editProfileValidation } from '../../validations/userValidation';
import { userService } from '../../services/userService';

export function useEditProfile() {
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
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(user?.dietaryPreferences ?? [])
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
    const [apiError, setApiError] = useState('')

    function togglePreference(pref: string) {
        setDietaryPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        )
    }

    async function requestPermission(type: 'camera' | 'gallery'): Promise<boolean> {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações.')
                return false
            }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações.')
                return false
            }
        }
        return true
    }

    async function openCamera() {
        const ok = await requestPermission('camera')
        if (!ok) return
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [1, 1],
            quality: 0.8,
        })
        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    async function openGallery() {
        const ok = await requestPermission('gallery')
        if (!ok) return
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

    function handlePickAvatar() {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancelar', 'Tirar foto', 'Escolher da galeria'],
                    cancelButtonIndex: 0,
                },
                (index) => {
                    if (index === 1) openCamera()
                    if (index === 2) openGallery()
                }
            )
        } else {
            Alert.alert('Foto de Perfil', 'Escolha uma opção', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tirar foto', onPress: openCamera },
                { text: 'Escolher da galeria', onPress: openGallery },
            ])
        }
    }

    async function handleSave() {
        try {
            setApiError('')
            await editProfileValidation.validate(
                { name, email, password, confirmPassword }, { abortEarly: false }
            )
            setErrors({})
            setLoading(true)
            const isNewAvatar = avatarUri && avatarUri !== user?.avatarUrl
            const preferencesChanged = JSON.stringify(dietaryPreferences) !== JSON.stringify(user?.dietaryPreferences ?? [])
            const hasChanges = name !== user?.name || email !== user?.email || !!password || !!isNewAvatar || preferencesChanged
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
                dietaryPreferences: preferencesChanged ? dietaryPreferences : undefined,
                avatar: isNewAvatar ? (() => {
                    const filename = avatarUri!.split('/').pop() ?? 'avatar.jpg'
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    return { uri: avatarUri!, name: filename, type }
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

    return {
        user, name, setName, email, setEmail, password, setPassword,
        confirmPassword, setConfirmPassword, showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword, editingField, setEditingField,
        loading, avatarUri, setAvatarUri, dietaryPreferences, errors, apiError,
        togglePreference, handlePickAvatar, handleSave
    }
}