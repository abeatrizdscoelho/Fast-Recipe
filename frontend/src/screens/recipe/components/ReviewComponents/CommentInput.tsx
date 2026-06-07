import React from 'react'
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
    value: string
    onChangeText: (t: string) => void
    onSubmit: () => void
    submitting: boolean
}

export function CommentInput({ value, onChangeText, onSubmit, submitting }: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const disabled = submitting || !value.trim()

    const dynStyles = StyleSheet.create({
        commentInputBox: {
            backgroundColor: theme.card,
            borderColor: theme.border,
        },
        commentInput: { color: theme.primary },
        commentSendBtn: { backgroundColor: theme.primary },
    })

    return (
        <View style={[styles.commentInputBox, dynStyles.commentInputBox]}>
            <TextInput
                style={[styles.commentInput, dynStyles.commentInput]}
                placeholder={t('commentInput.placeholder')}
                placeholderTextColor={theme.textMuted}
                value={value}
                onChangeText={onChangeText}
                multiline
                maxLength={1000}
            />
            <TouchableOpacity
                onPress={onSubmit}
                disabled={disabled}
                style={[styles.commentSendBtn, dynStyles.commentSendBtn, disabled && styles.commentSendBtnDisabled]}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                ) : (
                    <Ionicons name="send" size={16} color={colors.white} />
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    commentInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 8,
        borderWidth: 1,
    },
    commentInput: {
        flex: 1, 
        fontSize: 12,
        maxHeight: 100, 
        paddingVertical: 0,
    },
    commentSendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentSendBtnDisabled: { 
        opacity: 0.3 
    },
})