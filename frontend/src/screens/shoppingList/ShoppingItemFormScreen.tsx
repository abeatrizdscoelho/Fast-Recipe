import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors } from '@/src/theme/color'
import { SelectDropdown } from '@/src/components/SelectDropdown'
import FieldError from '@/src/components/FieldError'
import { useShoppingItemForm } from '@/src/hooks/shoppingList/useShoppingItemForm'
import { Header } from '@/src/components/Header'
import { BottomNav } from '@/src/components/BottomNav'
import { useTranslation } from 'react-i18next'

export default function ShoppingItemFormScreen() {
    const { t } = useTranslation()
    const {
        isEdit,
        name, setName,
        quantity, setQuantity,
        unit, setUnit,
        unitOpen, setUnitOpen,
        category, setCategory,
        allCategories,
        loading,
        errors,
        handleSave,
        INGREDIENT_UNITS,
    } = useShoppingItemForm()

    return (
        <View style={styles.container}>
            <Header />

            <KeyboardAwareScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            {isEdit ? t('shoppingItemForm.editTitle') : t('shoppingItemForm.addTitle')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.backBtn}
                        >
                            <Ionicons name="arrow-undo-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>{t('shoppingItemForm.labelIngredientName')}</Text>
                    <TextInput
                        style={[styles.input, errors.name ? styles.inputError : null]}
                        value={name}
                        onChangeText={setName}
                        placeholder={t('shoppingItemForm.placeholderIngredientName')}
                        placeholderTextColor="#aaa"
                        autoCapitalize="sentences"
                        onFocus={() => setUnitOpen(false)}
                    />
                    <FieldError message={errors.name} />

                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Text style={styles.label}>{t('shoppingItemForm.labelQuantity')}</Text>
                            <TextInput
                                style={[styles.input, errors.quantity ? styles.inputError : null]}
                                value={quantity}
                                onChangeText={setQuantity}
                                placeholder={t('shoppingItemForm.placeholderQuantity')}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#aaa"
                                onFocus={() => setUnitOpen(false)}
                            />
                            <FieldError message={errors.quantity} />
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.label}>{t('shoppingItemForm.labelUnit')}</Text>
                            <SelectDropdown
                                value={unit}
                                placeholder={t('shoppingItemForm.placeholderUnit')}
                                options={INGREDIENT_UNITS}
                                open={unitOpen}
                                onToggle={() => setUnitOpen(p => !p)}
                                onSelect={v => { setUnit(v); setUnitOpen(false) }}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>{t('shoppingItemForm.labelCategory')}</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chips}
                        style={styles.chipsScroll}
                    >
                        {allCategories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, category === cat && styles.chipActive]}
                                onPress={() => { setCategory(cat); setUnitOpen(false) }}
                            >
                                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                                    {t(`ingredientCategories.${cat}`, cat)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveBtnText}>
                            {loading 
                                ? t('shoppingItemForm.saving') 
                                : isEdit 
                                    ? t('shoppingItemForm.editAction') 
                                    : t('shoppingItemForm.addAction')
                            }
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 32 }} />
            </KeyboardAwareScrollView>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: 20,
        paddingBottom: 16,
    },
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
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    backBtn: {
        padding: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        marginTop: 16,
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
        borderColor: colors.error ?? '#e05c5c',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowItem: { flex: 1 },
    chipsScroll: {
        marginTop: 4,
        marginBottom: 8,
    },
    chips: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 2,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#e0d6d0',
        backgroundColor: '#fff',
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
        color: '#fff',
        fontWeight: '700',
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 5,
    },
    saveBtnDisabled: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
})