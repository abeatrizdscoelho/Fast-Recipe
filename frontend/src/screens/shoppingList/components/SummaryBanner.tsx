import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { router } from 'expo-router'

interface Props {
    totalRecipes: number
    weekStart: string
}

function formatWeekLabel(weekStart: string): string {
    const start = new Date(weekStart)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const fmt = (d: Date) => `${d.getDate()} de ${d.toLocaleString('pt-BR', { month: 'long' })}`
    return `Semana de ${fmt(start)} a ${fmt(end)}`
}

export function SummaryBanner({ totalRecipes, weekStart }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.iconBox}>
                    <Ionicons name="bag-check-outline" size={22} color={colors.primary} />
                </View>
                <View style={styles.textCol}>
                    <Text style={styles.title} numberOfLines={1}>
                        Lista gerada com base em {totalRecipes} receita{totalRecipes !== 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.week} numberOfLines={1}>{formatWeekLabel(weekStart)}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.planBtn} onPress={() => router.push('/planning')}>
                <Text style={styles.planBtnText}>Ver planejamento</Text>
                <Ionicons name="chevron-forward" size={13} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white, 
        borderRadius: 16,
        padding: 14, 
        marginBottom: 16, 
        gap: 12,
    },
    top: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10 
    },
    textCol: { flex: 1 },
    iconBox: {
        width: 40, 
        height: 40, 
        borderRadius: 10,
        backgroundColor: '#FFF0EC', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    title: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: '#333' 
    },
    week: { 
        fontSize: 11, 
        color: '#999', 
        marginTop: 2 
    },
    planBtn: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 4,
        borderWidth: 1, 
        borderColor: colors.primary,
        borderRadius: 20, 
        paddingHorizontal: 14, 
        paddingVertical: 7,
        alignSelf: 'flex-start',
    },
    planBtnText: { 
        fontSize: 12, 
        color: colors.primary, 
        fontWeight: '600' 
    },
})