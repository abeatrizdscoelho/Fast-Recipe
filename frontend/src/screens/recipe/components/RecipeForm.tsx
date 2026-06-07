import { router } from 'expo-router'
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RecipeFormData } from '@/src/types/recipe'
import FieldError from '@/src/components/FieldError'
import { SelectDropdown } from '@/src/components/SelectDropdown'
import { useTranslation } from 'react-i18next'
import { useRecipeForm } from '@/src/hooks/recipe/useRecipeForm'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
    initialData?: Partial<RecipeFormData>
    onSubmit: (data: RecipeFormData) => void
    submitLabel?: string
    loading?: boolean
}

export function RecipeForm({ initialData, onSubmit, submitLabel = 'Publicar Receita', loading = false }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const {
        title, setTitle, time, setTime,
        ingredients, ingredientInput, setIngredientInput, ingredientError,
        preparation, setPreparation, portions, setPortions,
        category, setCategory, categoryOpen, setCategoryOpen,
        dietaryRestrictions, toggleDietaryRestrictions,
        difficulty, setDifficulty, difficultyOpen, setDifficultyOpen,
        description, setDescription, photos, errors, apiError,
        handlePhotoPress, removePhoto, addIngredient, removeIngredient, handleSubmit,
        unitOpen, setUnitOpen, catIngOpen, setCatIngOpen,
        CATEGORIES, DIETARY_RESTRICTIONS, DIFFICULTIES, INGREDIENT_CATEGORIES, INGREDIENT_UNITS,
    } = useRecipeForm({ initialData, onSubmit })

    const dynStyles = StyleSheet.create({
        card: { backgroundColor: theme.card },
        cardTitle: { color: theme.textPrimary },
        label: { color: theme.textPrimary },
        input: { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary },
        photoAddBtn: { backgroundColor: theme.surfaceSecondary },
        photoBadge: { backgroundColor: theme.primary },
        tag: { backgroundColor: theme.primary },
        addButton: { backgroundColor: theme.primary },
        chip: { borderColor: theme.border },
        chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        chipText: { color: theme.textPrimary },
        submitButton: { backgroundColor: theme.primary },
    })

    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.card, dynStyles.card]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, dynStyles.cardTitle]}>{t('recipeForm.title')}</Text>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backBtn}>
                        <Ionicons name="arrow-undo-outline" size={22} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.label, dynStyles.label]}>
                    {t('recipeForm.photosLabel')} <Text style={styles.labelHint}>{t('recipeForm.photosMax')}</Text>
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
                    {photos.map((uri, index) => (
                        <View key={index} style={styles.photoThumb}>
                            <Image source={{ uri }} style={styles.photoThumbImage} />
                            {index === 0 && (
                                <View style={[styles.photoBadge, dynStyles.photoBadge]}>
                                    <Text style={styles.photoBadgeText}>{t('recipeForm.coverBadge')}</Text>
                                </View>
                            )}
                            <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(index)}>
                                <Ionicons name="close-circle" size={20} color="#e05c5c" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {photos.length < 5 && (
                        <TouchableOpacity style={[styles.photoAddBtn, dynStyles.photoAddBtn]} onPress={handlePhotoPress}>
                            <Ionicons name="camera-outline" size={28} color="rgba(0,0,0,0.3)" />
                            <Text style={styles.photoText}>
                                {photos.length === 0 ? t('recipeForm.addPhoto') : t('recipeForm.addMorePhotos')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                <FieldError message={errors.photos} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.titleLabel')}</Text>
                <TextInput
                    style={[styles.input, dynStyles.input, errors.title ? styles.inputError : null]}
                    placeholder={t('recipeForm.titlePlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    value={title}
                    onChangeText={setTitle}
                />
                <FieldError message={errors.title} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.ingredientsLabel')}</Text>
                <View style={styles.ingredientForm}>
                    <TextInput
                        style={[styles.input, dynStyles.input, ingredientError ? styles.inputError : null]}
                        placeholder={t('recipeForm.ingredientNamePlaceholder')}
                        placeholderTextColor={theme.textMuted}
                        value={ingredientInput.name}
                        onChangeText={v => setIngredientInput(prev => ({ ...prev, name: v }))}
                        returnKeyType="next"
                    />

                    <View style={styles.ingredientRow}>
                        <TextInput
                            style={[styles.input, styles.inputQty, dynStyles.input, ingredientError ? styles.inputError : null]}
                            placeholder={t('recipeForm.ingredientQtyPlaceholder')}
                            placeholderTextColor={theme.textMuted}
                            value={ingredientInput.quantity}
                            onChangeText={v => setIngredientInput(prev => ({ ...prev, quantity: v }))}
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                        />
                        <View style={styles.selectUnit}>
                            <SelectDropdown
                                value={ingredientInput.unit}
                                placeholder={t('recipeForm.ingredientUnitPlaceholder')}
                                options={INGREDIENT_UNITS}
                                open={unitOpen}
                                onToggle={() => { setUnitOpen(p => !p); setCatIngOpen(false) }}
                                onSelect={v => { setIngredientInput(prev => ({ ...prev, unit: v })); setUnitOpen(false) }}
                                error={ingredientError}
                            />
                        </View>
                    </View>

                    <SelectDropdown
                        value={ingredientInput.category}
                        placeholder={t('recipeForm.ingredientCategoryPlaceholder')}
                        options={INGREDIENT_CATEGORIES}
                        open={catIngOpen}
                        onToggle={() => { setCatIngOpen(p => !p); setUnitOpen(false) }}
                        onSelect={v => { setIngredientInput(prev => ({ ...prev, category: v })); setCatIngOpen(false) }}
                        error={ingredientError}
                    />
                </View>

                {ingredientError ? <FieldError message={ingredientError} /> : null}
                <FieldError message={errors.ingredients} />

                {ingredients.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {ingredients.map((ing, index) => (
                            <TouchableOpacity key={index} style={[styles.tag, dynStyles.tag]} onPress={() => removeIngredient(index)}>
                                <Text style={styles.tagText}>{ing.quantity} {ing.unit} — {ing.name}</Text>
                                <Ionicons name="close" size={12} color={theme.white} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={[styles.addButton, dynStyles.addButton]} onPress={addIngredient}>
                    <Ionicons name="add" size={18} color={theme.white} />
                    <Text style={styles.addButtonText}>{t('recipeForm.addIngredientBtn')}</Text>
                </TouchableOpacity>

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.preparationLabel')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea, dynStyles.input, errors.preparation ? styles.inputError : null]}
                    placeholder={t('recipeForm.preparationPlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    value={preparation}
                    onChangeText={setPreparation}
                    multiline numberOfLines={4} textAlignVertical="top"
                />
                <FieldError message={errors.preparation} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.timeLabel')}</Text>
                <TextInput
                    style={[styles.input, dynStyles.input, errors.time ? styles.inputError : null]}
                    placeholder={t('recipeForm.timePlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    value={time} onChangeText={setTime} keyboardType="numeric"
                />
                <FieldError message={errors.time} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.portionsLabel')}</Text>
                <TextInput
                    style={[styles.input, dynStyles.input, errors.portions ? styles.inputError : null]}
                    placeholder={t('recipeForm.portionsPlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    value={portions} onChangeText={setPortions} keyboardType="numeric"
                />
                <FieldError message={errors.portions} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.categoryLabel')}</Text>
                <SelectDropdown
                    value={category}
                    placeholder={t('recipeForm.categoryPlaceholder')}
                    options={CATEGORIES}
                    open={categoryOpen}
                    onToggle={() => { setCategoryOpen(p => !p) }}
                    onSelect={v => { setCategory(v); setCategoryOpen(false) }}
                    error={errors.category}
                />
                <FieldError message={errors.category} />

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.difficultyLabel')}</Text>
                <SelectDropdown
                    value={difficulty}
                    placeholder={t('recipeForm.difficultyPlaceholder')}
                    options={DIFFICULTIES}
                    open={difficultyOpen}
                    onToggle={() => setDifficultyOpen(p => !p)}
                    onSelect={v => { setDifficulty(v); setDifficultyOpen(false) }}
                    error={errors.difficulty}
                />
                <FieldError message={errors.difficulty} />

                <Text style={[styles.label, dynStyles.label]}>
                    {t('recipeForm.dietaryLabel')} <Text style={styles.labelHint}>{t('recipeForm.optional')}</Text>
                </Text>
                <Text style={styles.dietaryHint}>{t('recipeForm.dietaryHint')}</Text>
                <View style={styles.chipsContainer}>
                    {DIETARY_RESTRICTIONS.map(opt => {
                        const isSelected = dietaryRestrictions.includes(opt.key)
                        return (
                            <TouchableOpacity
                                key={opt.key}
                                style={[styles.chip, dynStyles.chip, isSelected && styles.chipActive, isSelected && dynStyles.chipActive]}
                                onPress={() => toggleDietaryRestrictions(opt.key)}
                            >
                                {isSelected && <Ionicons name="checkmark" size={13} color={theme.white} />}
                                <Text style={[styles.chipText, dynStyles.chipText, isSelected && styles.chipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={[styles.label, dynStyles.label]}>{t('recipeForm.descriptionLabel')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea, dynStyles.input, errors.description ? styles.inputError : null]}
                    placeholder={t('recipeForm.descriptionPlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    value={description} onChangeText={setDescription}
                    multiline numberOfLines={3} textAlignVertical="top"
                />
                <FieldError message={errors.description} />

                {apiError ? <FieldError message={apiError} centered={true} /> : null}

                <TouchableOpacity
                    style={[styles.submitButton, dynStyles.submitButton, loading && styles.submitDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>
                        {loading ? t('recipeForm.submitting') : (submitLabel || t('recipeForm.title'))}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1
    },
    content: {
        padding: 20,
        paddingBottom: 32
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7A0000',
    },
    backBtn: {
        padding: 4
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7A0000',
        marginBottom: 8,
        marginTop: 16,
    },
    labelHint: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#9CA3AF',
    },
    photoText: {
        color: 'rgba(0,0,0,0.35)',
        fontSize: 13
    },
    photosRow: {
        flexDirection: 'row',
        marginTop: 4
    },
    photoThumb: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
        position: 'relative',
    },
    photoThumbImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    photoBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: '#7A0000',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    photoBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold'
    },
    photoRemove: {
        position: 'absolute',
        top: -2,
        right: -2
    },
    photoAddBtn: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    inputError: {
        borderColor: '#DC2626'
    },
    textArea: {
        height: 100,
        paddingTop: 12
    },
    ingredientForm: {
        gap: 8,
        marginTop: 4
    },
    ingredientRow: {
        flexDirection: 'row',
        gap: 8
    },
    inputQty: {
        width: 90
    },
    selectUnit: {
        flex: 1
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#7A0000',
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#7A0000',
        borderRadius: 50,
        paddingVertical: 12,
        marginTop: 12,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    },
    dietaryHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 10,
        marginTop: -4,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 4,
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
        color: '#FFFFFF'
    },
    submitButton: {
        backgroundColor: '#7A0000',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 28,
    },
    submitDisabled: {
        opacity: 0.7
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
})