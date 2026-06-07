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
import { useTheme } from '@/src/context/ThemeContext'

export default function ShoppingItemFormScreen() {
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
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

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        card: { backgroundColor: theme.card },
        cardTitle: { color: theme.primary },
        label: { color: theme.primary },
        input: {
            borderColor: theme.border,
            backgroundColor: isDark ? theme.surfaceSecondary : '#fafafa',
            color: theme.textPrimary,
        },
        chip: {
            borderColor: isDark ? theme.border : '#e0d6d0',
            backgroundColor: theme.card,
        },
        chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        chipText: { color: theme.primary },
        saveBtn: { backgroundColor: theme.primary },
    })

    return (
        <View style={[styles.container, dynStyles.container]}>
            <Header />

            <KeyboardAwareScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.card, dynStyles.card]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, dynStyles.cardTitle]}>
                            {isEdit ? t('shoppingItemForm.editTitle') : t('shoppingItemForm.addTitle')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.backBtn}
                        >
                            <Ionicons name="arrow-undo-outline" size={22} color={theme.primary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, dynStyles.label]}>{t('shoppingItemForm.labelIngredientName')}</Text>
                    <TextInput
                        style={[styles.input, dynStyles.input, errors.name ? styles.inputError : null]}
                        value={name}
                        onChangeText={setName}
                        placeholder={t('shoppingItemForm.placeholderIngredientName')}
                        placeholderTextColor={theme.textMuted}
                        autoCapitalize="sentences"
                        onFocus={() => setUnitOpen(false)}
                    />
                    <FieldError message={errors.name} />

                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Text style={[styles.label, dynStyles.label]}>{t('shoppingItemForm.labelQuantity')}</Text>
                            <TextInput
                                style={[styles.input, dynStyles.input, errors.quantity ? styles.inputError : null]}
                                value={quantity}
                                onChangeText={setQuantity}
                                placeholder={t('shoppingItemForm.placeholderQuantity')}
                                keyboardType="decimal-pad"
                                placeholderTextColor={theme.textMuted}
                                onFocus={() => setUnitOpen(false)}
                            />
                            <FieldError message={errors.quantity} />
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={[styles.label, dynStyles.label]}>{t('shoppingItemForm.labelUnit')}</Text>
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

                    <Text style={[styles.label, dynStyles.label]}>{t('shoppingItemForm.labelCategory')}</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chips}
                        style={styles.chipsScroll}
                    >
                        {allCategories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, dynStyles.chip, category === cat && dynStyles.chipActive]}
                                onPress={() => { setCategory(cat); setUnitOpen(false) }}
                            >
                                <Text style={[styles.chipText, dynStyles.chipText, category === cat && styles.chipTextActive]}>
                                    {t(`ingredientCategories.${cat}`, cat)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveBtn, dynStyles.saveBtn, loading && styles.saveBtnDisabled]}
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
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: 20,
        paddingBottom: 16,
    },
    card: {
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
    },
    backBtn: {
        padding: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
    },
    inputError: {
        borderColor: '#e05c5c',
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
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: colors.white,
        fontWeight: '700',
    },
    saveBtn: {
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 5,
    },
    saveBtnDisabled: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
})