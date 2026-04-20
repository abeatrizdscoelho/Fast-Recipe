import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RecipeFormData } from '@/src/types/recipe';
import { CATEGORIES, DIETARY_RESTRICTIONS, DIFFICULTIES, useRecipeForm } from '@/src/hooks/recipe/useRecipeForm';
import { colors } from '@/src/theme/color';
import FieldError from '@/src/components/FieldError';

type Props = {
    initialData?: Partial<RecipeFormData>
    onSubmit: (data: RecipeFormData) => void
    submitLabel?: string
    loading?: boolean
}

export function RecipeForm({ initialData, onSubmit, submitLabel = 'Publicar Receita', loading = false }: Props) {
    const {
        title, setTitle, time, setTime, ingredients, ingredientInput, setIngredientInput,
        preparation, setPreparation, portions, setPortions, category, setCategory,
        categoryOpen, setCategoryOpen, dietaryRestrictions, toggleDietaryRestrictions,
        difficulty, setDifficulty, difficultyOpen, setDifficultyOpen,
        description, setDescription, photos, errors, apiError,
        handlePhotoPress, removePhoto, addIngredient, removeIngredient, handleSubmit
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
                <TextInput
                    style={[styles.input, errors.ingredients ? styles.inputError : null]}
                    placeholder="Ex: 2 xícaras de farinha"
                    placeholderTextColor="#aaa"
                    value={ingredientInput}
                    onChangeText={setIngredientInput}
                    onSubmitEditing={addIngredient}
                    returnKeyType="done"
                />
                <FieldError message={errors.ingredients} />

                {ingredients.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {ingredients.map((ing, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.tag}
                                onPress={() => removeIngredient(index)}
                            >
                                <Text style={styles.tagText}>{ing}</Text>
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
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
                <FieldError message={errors.preparation} />

                <Text style={styles.label}>Tempo de Preparo</Text>
                <TextInput
                    style={[styles.input, errors.time ? styles.inputError : null]}
                    placeholder="Ex: 45min"
                    placeholderTextColor="#aaa"
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                />
                <FieldError message={errors.time} />

                <Text style={styles.label}>Porções</Text>
                <TextInput
                    style={[styles.input, errors.portions ? styles.inputError : null]}
                    placeholder="Ex: 4 porções"
                    placeholderTextColor="#aaa"
                    value={portions}
                    onChangeText={setPortions}
                    keyboardType="numeric"
                />
                <FieldError message={errors.portions} />

                <Text style={styles.label}>Categoria</Text>
                <TouchableOpacity
                    style={[styles.select, errors.category ? styles.inputError : null]}
                    onPress={() => setCategoryOpen(prev => !prev)}
                >
                    <Text style={[styles.selectText, !category && { color: '#aaa' }]}>
                        {category || 'Selecione uma categoria'}
                    </Text>
                    <Ionicons
                        name={categoryOpen ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#aaa"
                    />
                </TouchableOpacity>
                <FieldError message={errors.category} />

                {categoryOpen && (
                    <View style={styles.dropdown}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.dropdownItem, category === cat && styles.dropdownItemActive]}
                                onPress={() => { setCategory(cat); setCategoryOpen(false) }}
                            >
                                <Text style={[styles.dropdownText, category === cat && styles.dropdownTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Dificuldade</Text>
                <TouchableOpacity
                    style={[styles.select, errors.difficulty ? styles.inputError : null]}
                    onPress={() => setDifficultyOpen(prev => !prev)}
                >
                    <Text style={[styles.selectText, !difficulty && { color: '#aaa' }]}>
                        {difficulty || 'Selecione a dificuldade'}
                    </Text>
                    <Ionicons
                        name={difficultyOpen ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#aaa"
                    />
                </TouchableOpacity>
                <FieldError message={errors.difficulty} />

                {difficultyOpen && (
                    <View style={styles.dropdown}>
                        {DIFFICULTIES.map((diff) => (
                            <TouchableOpacity
                                key={diff}
                                style={[styles.dropdownItem, difficulty === diff && styles.dropdownItemActive]}
                                onPress={() => { setDifficulty(diff); setDifficultyOpen(false) }}
                            >
                                <Text style={[styles.dropdownText, difficulty === diff && styles.dropdownTextActive]}>
                                    {diff}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

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
                                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
                    placeholder="Uma breve descrição da receita..."
                    placeholderTextColor="#aaa"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
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
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
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
    photosRow: {
        flexDirection: 'row',
        marginTop: 4,
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
        borderRadius: 10,
    },
    photoBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: colors.primary,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    photoBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    photoRemove: {
        position: 'absolute',
        top: -2,
        right: -2,
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
    inputError: { borderColor: colors.error ?? '#e05c5c' },
    textArea: { height: 100, paddingTop: 12 },

    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
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

    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#fafafa',
    },
    selectText: { fontSize: 14, color: '#333' },
    dropdown: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginTop: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemActive: { backgroundColor: '#FFF5EC' },
    dropdownText: { fontSize: 14, color: '#333' },
    dropdownTextActive: { color: colors.primary, fontWeight: 'bold' },

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
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
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
    submitText: { color: colors.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
})