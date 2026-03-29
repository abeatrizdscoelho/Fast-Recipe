import { useState } from 'react';
import { Alert, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ValidationError } from 'yup';
import { RecipeFormData } from '../../types/recipe';
import { recipeValidation } from '../../validations/recipeValidation';

export const CATEGORIES = [
    'Café da manhã', 'Almoço', 'Jantar', 'Lanche',
    'Sobremesa', 'Bebida', 'Vegano', 'Vegetariano',
]

export const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']

type UseRecipeFormProps = {
    initialData?: Partial<RecipeFormData>
    onSubmit: (data: RecipeFormData) => void
}

export function useRecipeForm({ initialData, onSubmit }: UseRecipeFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [time, setTime] = useState(initialData?.time ?? '')
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients ?? [])
    const [ingredientInput, setIngredientInput] = useState('')
    const [preparation, setPreparation] = useState(initialData?.preparation ?? '')
    const [portions, setPortions] = useState(initialData?.portions ?? '')
    const [category, setCategory] = useState(initialData?.category ?? '')
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? '')
    const [description, setDescription] = useState(initialData?.description ?? '')
    const [difficultyOpen, setDifficultyOpen] = useState(false)
    const [photos, setPhotos] = useState<string[]>(initialData?.photos ?? [])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [apiError, setApiError] = useState('')

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
            aspect: [4, 3],
            quality: 0.8,
        })
        if (!result.canceled) {
            setPhotos(prev => prev.length < 5 ? [...prev, result.assets[0].uri] : prev)
        }
    }

    async function openGallery() {
        const ok = await requestPermission('gallery')
        if (!ok) return
        const remaining = 5 - photos.length
        if (remaining <= 0) {
            Alert.alert('Limite atingido', 'Você pode adicionar no máximo 5 fotos.')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.8,
        })
        if (!result.canceled) {
            const uris = result.assets.map(a => a.uri)
            setPhotos(prev => [...prev, ...uris].slice(0, 5))
        }
    }

    function removePhoto(index: number) {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }

    function handlePhotoPress() {
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
            Alert.alert('Foto da Receita', 'Escolha uma opção', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tirar foto', onPress: openCamera },
                { text: 'Escolher da galeria', onPress: openGallery },
            ])
        }
    }

    function addIngredient() {
        const trimmed = ingredientInput.trim()
        if (!trimmed) return
        setIngredients(prev => [...prev, trimmed])
        setIngredientInput('')
    }

    function removeIngredient(index: number) {
        setIngredients(prev => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit() {
        try {
            setApiError('')
            const data = { title, time, ingredients, preparation, portions, category, photos, difficulty, description }
            await recipeValidation.validate(data, { abortEarly: false })
            setErrors({})
            onSubmit(data as RecipeFormData)
        } catch (err) {
            if (err instanceof ValidationError) {
                const fieldErrors: Record<string, string> = {}
                err.inner.forEach(e => {
                    if (e.path) fieldErrors[e.path] = e.message
                })
                setErrors(fieldErrors)
            } else {
                setApiError(err instanceof Error ? err.message : 'Erro ao publicar receita')
            }
        }
    }

    return {
        title, setTitle, time, setTime, ingredients, ingredientInput, setIngredientInput,
        preparation, setPreparation, portions, setPortions, category, setCategory,
        categoryOpen, setCategoryOpen, difficulty, setDifficulty, difficultyOpen, setDifficultyOpen,
        description, setDescription, photos, errors, apiError,
        handlePhotoPress, removePhoto, addIngredient, removeIngredient, handleSubmit
    }
}