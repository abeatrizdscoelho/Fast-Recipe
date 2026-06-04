import { useState } from 'react'
import { Alert, Platform, ActionSheetIOS } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { ValidationError } from 'yup'
import { IngredientDTO, RecipeFormData } from '@/src/types/recipe'
import { recipeValidation } from '@/src/validations/recipeValidation'
import { useAppConstants } from '../useAppConstants'
import { useTranslation } from 'react-i18next'

type IngredientInput = {
    name: string
    quantity: string
    unit: string
    category: string
}

const EMPTY_INGREDIENT: IngredientInput = { name: '', quantity: '', unit: '', category: '' }

type UseRecipeFormProps = {
    initialData?: Partial<RecipeFormData>
    onSubmit: (data: RecipeFormData) => void
}

export function useRecipeForm({ initialData, onSubmit }: UseRecipeFormProps) {
    const { t } = useTranslation()
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [time, setTime] = useState(initialData?.time ?? '')
    const [preparation, setPreparation] = useState(initialData?.preparation ?? '')
    const [portions, setPortions] = useState(initialData?.portions ?? '')
    const [category, setCategory] = useState(initialData?.category ?? '')
    const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? '')
    const [description, setDescription] = useState(initialData?.description ?? '')
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(initialData?.dietaryRestrictions ?? [])
    const [photos, setPhotos] = useState<string[]>(initialData?.photos ?? [])

    const [ingredients, setIngredients] = useState<IngredientDTO[]>(initialData?.ingredients ?? [])
    const [ingredientInput, setIngredientInput] = useState<IngredientInput>(EMPTY_INGREDIENT)
    const [ingredientError, setIngredientError] = useState('')

    const [categoryOpen, setCategoryOpen] = useState(false)
    const [difficultyOpen, setDifficultyOpen] = useState(false)
    const [unitOpen, setUnitOpen] = useState(false)
    const [catIngOpen, setCatIngOpen] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [apiError, setApiError] = useState('')

    const {
        CATEGORIES, DIETARY_RESTRICTIONS, DIFFICULTIES,
        INGREDIENT_CATEGORIES, INGREDIENT_UNITS,
    } = useAppConstants()

    function closeAllDropdowns() {
        setCategoryOpen(false)
        setDifficultyOpen(false)
        setUnitOpen(false)
        setCatIngOpen(false)
    }

    async function requestPermission(type: 'camera' | 'gallery'): Promise<boolean> {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(t('editProfile.permissionTitle'), t('editProfile.permissionCamera'))
                return false
            }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(t('editProfile.permissionTitle'), t('editProfile.permissionGallery'))
                return false
            }
        }
        return true
    }

    async function openCamera() {
        const ok = await requestPermission('camera')
        if (!ok) return
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8,
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
            Alert.alert(t('recipeForm.photoLimitTitle'), t('recipeForm.photoLimitMessage'))
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, allowsMultipleSelection: true,
            selectionLimit: remaining, quality: 0.8,
        })
        if (!result.canceled) {
            setPhotos(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5))
        }
    }

    function removePhoto(index: number) {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }

    function handlePhotoPress() {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: [t('common.cancel'), t('editProfile.avatarCamera'), t('editProfile.avatarGallery')],
                    cancelButtonIndex: 0,
                },
                (index) => { if (index === 1) openCamera(); if (index === 2) openGallery() }
            )
        } else {
            Alert.alert(t('recipeForm.photoPickerTitle'), t('recipeForm.photoPickerSubtitle'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('editProfile.avatarCamera'), onPress: openCamera },
                { text: t('editProfile.avatarGallery'), onPress: openGallery },
            ])
        }
    }

    function addIngredient() {
        const { name, quantity, unit, category: cat } = ingredientInput
        if (!name.trim()) { setIngredientError(t('recipeForm.ingredientErrorName')); return }
        const qty = parseFloat(quantity.replace(',', '.'))
        if (isNaN(qty) || qty <= 0) { setIngredientError(t('recipeForm.ingredientErrorQuantity')); return }
        if (!unit.trim()) { setIngredientError(t('recipeForm.ingredientErrorUnit')); return }
        setIngredientError('')
        setIngredients(prev => [...prev, { name: name.trim(), quantity: qty, unit: unit.trim(), category: cat }])
        setIngredientInput(EMPTY_INGREDIENT)
    }

    function removeIngredient(index: number) {
        setIngredients(prev => prev.filter((_, i) => i !== index))
    }

    function toggleDietaryRestrictions(option: string) {
        setDietaryRestrictions(prev =>
            prev.includes(option) ? prev.filter(d => d !== option) : [...prev, option]
        )
    }

    async function handleSubmit() {
        try {
            setApiError('')
            const data = {
                title, time, ingredients, preparation, portions,
                category, dietaryRestrictions, photos, difficulty, description,
            }
            await recipeValidation.validate(data, { abortEarly: false })
            setErrors({})
            onSubmit(data as RecipeFormData)
        } catch (err) {
            if (err instanceof ValidationError) {
                const fieldErrors: Record<string, string> = {}
                err.inner.forEach(e => { if (e.path) fieldErrors[e.path] = e.message })
                setErrors(fieldErrors)
            } else {
                setApiError(err instanceof Error ? err.message : t('recipeForm.submitError'))
            }
        }
    }

    return {
        title, setTitle,
        time, setTime,
        preparation, setPreparation,
        portions, setPortions,
        category, setCategory,
        difficulty, setDifficulty,
        description, setDescription,
        dietaryRestrictions, toggleDietaryRestrictions,

        photos, handlePhotoPress, removePhoto,

        ingredients, ingredientInput, setIngredientInput, ingredientError,
        addIngredient, removeIngredient,

        categoryOpen, setCategoryOpen,
        difficultyOpen, setDifficultyOpen,
        unitOpen, setUnitOpen,
        catIngOpen, setCatIngOpen,
        closeAllDropdowns,

        errors, apiError,
        handleSubmit,

        CATEGORIES,
        DIETARY_RESTRICTIONS,
        DIFFICULTIES,
        INGREDIENT_CATEGORIES,
        INGREDIENT_UNITS,
    }
}