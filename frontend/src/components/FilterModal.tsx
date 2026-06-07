import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

export type ActiveFilters = {
    categories: string[]
    dietaryRestrictions: string[]
}

type Props = {
    visible: boolean
    filters: ActiveFilters
    onClose: () => void
    onApply: (filters: ActiveFilters) => void
    categories: { key: string; label: string }[]
    dietaryRestrictions: { key: string; label: string }[]
}

export function FilterModal({ visible, filters, onClose, onApply, categories, dietaryRestrictions }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const [local, setLocal] = React.useState<ActiveFilters>(filters)

    React.useEffect(() => {
        if (visible) setLocal(filters)
    }, [visible])

    function toggle(key: keyof ActiveFilters, value: string) {
        setLocal(prev => ({
            ...prev,
            [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value],
        }))
    }

    function handleClear() {
        setLocal({ categories: [], dietaryRestrictions: [] })
    }

    function handleApply() {
        onApply(local)
        onClose()
    }

    const totalSelected = local.categories.length + local.dietaryRestrictions.length

    const dynStyles = StyleSheet.create({
        sheet: { backgroundColor: theme.card },
        header: { borderBottomColor: theme.border },
        title: { color: theme.textPrimary },
        sectionLabel: { color: theme.textPrimary },
        chip: { borderColor: theme.border },
        chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        chipText: { color: theme.textPrimary },
        footer: { borderTopColor: theme.border },
        clearText: { color: theme.textPrimary },
        applyBtn: { backgroundColor: theme.primary },
    })

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <View style={styles.modalWrapper}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

                <View style={[styles.sheet, dynStyles.sheet]}>
                    <View style={[styles.header, dynStyles.header]}>
                        <Text style={[styles.title, dynStyles.title]}>{t('filterModal.title')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color={theme.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
                        <Text style={[styles.sectionLabel, dynStyles.sectionLabel]}>{t('filterModal.categoryLabel')}</Text>
                        <Text style={styles.sectionHint}>{t('filterModal.selectionHint')}</Text>
                        <View style={styles.chipsContainer}>
                            {categories.map(({ key, label }) => {
                                const isSelected = local.categories.includes(key)
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[styles.chip, dynStyles.chip, isSelected && styles.chipActive, isSelected && dynStyles.chipActive]}
                                        onPress={() => toggle('categories', key)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={13} color={theme.white} />}
                                        <Text style={[styles.chipText, dynStyles.chipText, isSelected && styles.chipTextActive]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <Text style={[styles.sectionLabel, dynStyles.sectionLabel, { marginTop: 24 }]}>{t('filterModal.dietaryLabel')}</Text>
                        <Text style={styles.sectionHint}>{t('filterModal.selectionHint')}</Text>
                        <View style={styles.chipsContainer}>
                            {dietaryRestrictions.map(({ key, label }) => {
                                const isSelected = local.dietaryRestrictions.includes(key)
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[styles.chip, dynStyles.chip, isSelected && styles.chipActive, isSelected && dynStyles.chipActive]}
                                        onPress={() => toggle('dietaryRestrictions', key)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={13} color={theme.white} />}
                                        <Text style={[styles.chipText, dynStyles.chipText, isSelected && styles.chipTextActive]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, dynStyles.footer]}>
                        <TouchableOpacity
                            style={styles.clearBtn}
                            onPress={handleClear}
                            disabled={totalSelected === 0}
                        >
                            <Text style={[styles.clearText, dynStyles.clearText, totalSelected === 0 && styles.clearTextDisabled]}>
                                {t('filterModal.clearBtn')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.applyBtn, dynStyles.applyBtn]} onPress={handleApply}>
                            <Text style={styles.applyText}>
                                {totalSelected > 0
                                    ? t('filterModal.applyBtnCount', { count: totalSelected })
                                    : t('filterModal.applyBtn')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '75%',
        paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0ebe8',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7A0000',
    },
    body: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7A0000',
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 10,
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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0ebe8',
        gap: 12,
    },
    clearBtn: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7A0000',
    },
    clearTextDisabled: {
        color: '#9CA3AF',
    },
    applyBtn: {
        flex: 1,
        backgroundColor: '#7A0000',
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 14,
    },
})