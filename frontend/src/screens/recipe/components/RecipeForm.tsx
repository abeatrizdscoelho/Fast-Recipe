import { router } from 'expo-router'
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RecipeFormData } from '@/src/types/recipe'
import {
    CATEGORIES, DIETARY_RESTRICTIONS, DIFFICULTIES,
    INGREDIENT_CATEGORIES, INGREDIENT_UNITS,
    useRecipeForm,
} from '@/src/hooks/recipe/useRecipeForm'
import { colors } from '@/src/theme/color'
import FieldError from '@/src/components/FieldError'
import { SelectDropdown } from '@/src/components/SelectDropdown'

type Props = {
    initialData?: Partial<RecipeFormData>
    onSubmit: (data: RecipeFormData) => void
    submitLabel?: string
    loading?: boolean
}

export function RecipeForm({ initialData, onSubmit, submitLabel = 'Publicar Receita', loading = false }: Props) {
    const {
        title, setTitle, time, setTime,
        ingredients, ingredientInput, setIngredientInput, ingredientError,
        preparation, setPreparation, portions, setPortions,
        category, setCategory, categoryOpen, setCategoryOpen,
        dietaryRestrictions, toggleDietaryRestrictions,
        difficulty, setDifficulty, difficultyOpen, setDifficultyOpen,
        description, setDescription, photos, errors, apiError,
        handlePhotoPress, removePhoto, addIngredient, removeIngredient, handleSubmit,
        unitOpen, setUnitOpen, catIngOpen, setCatIngOpen, closeAllDropdowns
    } = useRecipeForm({ initialData, onSubmit })

    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Cadastro de Receita</Text>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backBtn}>
                        <Ionicons name="arrow-undo-outline" size={22} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Fotos da Receita <Text style={styles.labelHint}>(máx. 5)</Text></Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
                    {photos.map((uri, index) => (
                        <View key={index} style={styles.photoThumb}>
                            <Image source={{ uri }} style={styles.photoThumbImage} />
                            {index === 0 && (
                                <View style={styles.photoBadge}>
                                    <Text style={styles.photoBadgeText}>Capa</Text>
                                </View>
                            )}
                            <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(index)}>
                                <Ionicons name="close-circle" size={20} color="#e05c5c" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {photos.length < 5 && (
                        <TouchableOpacity style={styles.photoAddBtn} onPress={handlePhotoPress}>
                            <Ionicons name="camera-outline" size={28} color="rgba(0,0,0,0.3)" />
                            <Text style={styles.photoText}>
                                {photos.length === 0 ? 'Adicionar foto' : 'Adicionar mais'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                <FieldError message={errors.photos} />

                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={[styles.input, errors.title ? styles.inputError : null]}
                    placeholder="Digite o título da receita"
                    placeholderTextColor="#aaa"
                    value={title}
                    onChangeText={setTitle}
                />
                <FieldError message={errors.title} />

                <Text style={styles.label}>Ingredientes</Text>
                <View style={styles.ingredientForm}>
                    <TextInput
                        style={[styles.input, ingredientError ? styles.inputError : null]}
                        placeholder="Nome do ingrediente"
                        placeholderTextColor="#aaa"
                        value={ingredientInput.name}
                        onChangeText={v => setIngredientInput(prev => ({ ...prev, name: v }))}
                        returnKeyType="next"
                    />

                    <View style={styles.ingredientRow}>
                        <TextInput
                            style={[styles.input, styles.inputQty, ingredientError ? styles.inputError : null]}
                            placeholder="Qtd."
                            placeholderTextColor="#aaa"
                            value={ingredientInput.quantity}
                            onChangeText={v => setIngredientInput(prev => ({ ...prev, quantity: v }))}
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                        />
                        <View style={styles.selectUnit}>
                            <SelectDropdown
                                value={ingredientInput.unit}
                                placeholder="Selecione a unidade"
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
                        placeholder="Categoria do ingrediente"
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
                            <TouchableOpacity key={index} style={styles.tag} onPress={() => removeIngredient(index)}>
                                <Text style={styles.tagText}>{ing.quantity} {ing.unit} — {ing.name}</Text>
                                <Ionicons name="close" size={12} color={colors.white} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                    <Ionicons name="add" size={18} color={colors.white} />
                    <Text style={styles.addButtonText}>Adicionar Ingrediente</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Modo de Preparo</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.preparation ? styles.inputError : null]}
                    placeholder="Descreva a etapa de preparo..."
                    placeholderTextColor="#aaa"
                    value={preparation}
                    onChangeText={setPreparation}
                    multiline numberOfLines={4} textAlignVertical="top"
                />
                <FieldError message={errors.preparation} />

                <Text style={styles.label}>Tempo de Preparo</Text>
                <TextInput
                    style={[styles.input, errors.time ? styles.inputError : null]}
                    placeholder="Ex: 45min"
                    placeholderTextColor="#aaa"
                    value={time} onChangeText={setTime} keyboardType="numeric"
                />
                <FieldError message={errors.time} />

                <Text style={styles.label}>Porções</Text>
                <TextInput
                    style={[styles.input, errors.portions ? styles.inputError : null]}
                    placeholder="Ex: 4 porções"
                    placeholderTextColor="#aaa"
                    value={portions} onChangeText={setPortions} keyboardType="numeric"
                />
                <FieldError message={errors.portions} />

                <Text style={styles.label}>Categoria</Text>
                <SelectDropdown
                    value={category}
                    placeholder="Selecione uma categoria"
                    options={CATEGORIES}
                    open={categoryOpen}
                    onToggle={() => { setCategoryOpen(p => !p)}}
                    onSelect={v => { setCategory(v); setCategoryOpen(false) }}
                    error={errors.category}
                />
                <FieldError message={errors.category} />

                <Text style={styles.label}>Dificuldade</Text>
                <SelectDropdown
                    value={difficulty}
                    placeholder="Selecione a dificuldade"
                    options={DIFFICULTIES}
                    open={difficultyOpen}
                    onToggle={() => setDifficultyOpen(p => !p)}
                    onSelect={v => { setDifficulty(v); setDifficultyOpen(false) }}
                    error={errors.difficulty}
                />
                <FieldError message={errors.difficulty} />

                <Text style={styles.label}>
                    Restrições Alimentares <Text style={styles.labelHint}>(opcional)</Text>
                </Text>
                <Text style={styles.dietaryHint}>Toque para selecionar ou remover</Text>
                <View style={styles.chipsContainer}>
                    {DIETARY_RESTRICTIONS.map(opt => {
                        const isSelected = dietaryRestrictions.includes(opt)
                        return (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.chip, isSelected && styles.chipActive]}
                                onPress={() => toggleDietaryRestrictions(opt)}
                            >
                                {isSelected && <Ionicons name="checkmark" size={13} color={colors.white} />}
                                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
                    placeholder="Uma breve descrição da receita..."
                    placeholderTextColor="#aaa"
                    value={description} onChangeText={setDescription}
                    multiline numberOfLines={3} textAlignVertical="top"
                />
                <FieldError message={errors.description} />

                {apiError ? <FieldError message={apiError} centered={true} /> : null}

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>{loading ? 'PUBLICANDO...' : submitLabel}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: 20, paddingBottom: 32 },
    card: {
        backgroundColor: colors.white,
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
        color: colors.primary,
    },
    backBtn: { padding: 4 },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        marginTop: 16,
    },
    labelHint: {
        fontSize: 12,
        fontWeight: 'normal',
        color: colors.gray,
    },
    photoText: { color: 'rgba(0,0,0,0.35)', fontSize: 13 },
    photosRow: { flexDirection: 'row', marginTop: 4 },
    photoThumb: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
        position: 'relative',
    },
    photoThumbImage: { width: '100%', height: '100%', borderRadius: 10 },
    photoBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: colors.primary,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    photoBadgeText: { color: colors.white, fontSize: 10, fontWeight: 'bold' },
    photoRemove: { position: 'absolute', top: -2, right: -2 },
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
    inputError: { borderColor: colors.error ?? '#e05c5c' },
    textArea: { height: 100, paddingTop: 12 },
    ingredientForm: { gap: 8, marginTop: 4 },
    ingredientRow: { flexDirection: 'row', gap: 8 },
    inputQty: { width: 90 },
    selectUnit: { flex: 1 },
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
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 12,
        marginTop: 12,
    },
    addButtonText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
    dietaryHint: {
        fontSize: 12,
        color: colors.gray,
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
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    chipTextActive: { color: colors.white },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 28,
    },
    submitDisabled: { opacity: 0.7 },
    submitText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
})