import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { colors } from '../theme/color'

const CATEGORIES = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche', 'Sobremesa', 'Bebida']
const DIETARY_RESTRICTIONS = [
    'Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 'Sem açúcar', 'Low carb', 'Cetogênico'
]

export type ActiveFilters = {
    categories: string[]
    dietaryRestrictions: string[]
}

type Props = {
    visible: boolean
    filters: ActiveFilters
    onClose: () => void
    onApply: (filters: ActiveFilters) => void
}

export function FilterModal({ visible, filters, onClose, onApply }: Props) {
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

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <View style={styles.modalWrapper}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtrar receitas</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
                        <Text style={styles.sectionLabel}>Categoria</Text>
                        <Text style={styles.sectionHint}>Toque para selecionar ou remover</Text>
                        <View style={styles.chipsContainer}>
                            {CATEGORIES.map(cat => {
                                const isSelected = local.categories.includes(cat)
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.chip, isSelected && styles.chipActive]}
                                        onPress={() => toggle('categories', cat)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={13} color={colors.white} />}
                                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Restrição alimentar</Text>
                        <Text style={styles.sectionHint}>Toque para selecionar ou remover</Text>
                        <View style={styles.chipsContainer}>
                            {DIETARY_RESTRICTIONS.map(opt => {
                                const isSelected = local.dietaryRestrictions.includes(opt)
                                return (
                                    <TouchableOpacity
                                        key={opt}
                                        style={[styles.chip, isSelected && styles.chipActive]}
                                        onPress={() => toggle('dietaryRestrictions', opt)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={13} color={colors.white} />}
                                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                            {opt}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.clearBtn}
                            onPress={handleClear}
                            disabled={totalSelected === 0}
                        >
                            <Text style={[styles.clearText, totalSelected === 0 && styles.clearTextDisabled]}>
                                Limpar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyText}>
                                {totalSelected > 0 ? `Aplicar (${totalSelected})` : 'Aplicar'}
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
        backgroundColor: colors.white,
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
        color: colors.primary,
    },
    body: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 12,
        color: colors.gray,
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
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    chipTextActive: { color: colors.white },
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
    clearBtn: { paddingVertical: 14, paddingHorizontal: 20 },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    clearTextDisabled: { color: colors.gray },
    applyBtn: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyText: {
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 14,
    },
})