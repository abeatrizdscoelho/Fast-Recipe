import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../theme/color'
import { useRecipeTimer } from '../../../hooks/recipe/useRecipeTimer'
import { useTranslation } from 'react-i18next'

interface Props {
    time: string
    recipeTitle: string
    onFinished?: () => void
}

export function RecipeTimer({ time, recipeTitle, onFinished }: Props) {
    const { t } = useTranslation()
    const {
        formatted, progress, isRunning, isFinished, totalSeconds, start, pause, reset
    } = useRecipeTimer(time, recipeTitle)

    useEffect(() => {
        if (isFinished) {
            Vibration.vibrate([0, 400, 200, 400])
            onFinished?.()  
        }
    }, [isFinished])

    if (totalSeconds === 0) return null

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <Text style={styles.label}>{t('recipeTimer.title')}</Text>
            </View>

            <View style={styles.timerRow}>
                <View style={styles.circleWrapper}>
                    <View style={styles.circleBg} />

                    <Text style={[styles.timeText, isFinished && styles.timeTextDone]}>
                        {isFinished ? '✓' : formatted}
                    </Text>
                </View>

                <View style={styles.controls}>
                    {!isFinished ? (
                        <>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnPrimary]}
                                onPress={isRunning ? pause : start}
                            >
                                <Ionicons
                                    name={isRunning ? 'pause' : 'play'}
                                    size={18}
                                    color={colors.white}
                                />
                                <Text style={styles.btnText}>
                                    {isRunning ? t('recipeTimer.pause') : t('recipeTimer.start')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={reset}>
                                <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                                <Text style={styles.btnTextSecondary}>{t('recipeTimer.reset')}</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.doneText}>{t('recipeTimer.done')}</Text>
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={reset}>
                                <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                                <Text style={styles.btnTextSecondary}>{t('recipeTimer.useAgain')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>

            {isRunning && (
                <Text style={styles.hint}>{t('recipeTimer.backgroundHint')}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.primary,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    circleWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleBg: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    timeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        letterSpacing: 1,
    },
    timeTextDone: {
        fontSize: 28,
    },
    controls: {
        flex: 1,
        gap: 8,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    btnPrimary: {
        backgroundColor: colors.primary,
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    btnText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    btnTextSecondary: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    doneText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
    },
    progressBar: {
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    hint: {
        fontSize: 11,
        color: '#aaa',
        textAlign: 'center',
    },
})