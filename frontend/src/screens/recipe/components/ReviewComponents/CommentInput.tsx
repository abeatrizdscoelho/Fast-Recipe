import React from 'react'
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'

type Props = {
    value: string
    onChangeText: (t: string) => void
    onSubmit: () => void
    submitting: boolean
}

export function CommentInput({ value, onChangeText, onSubmit, submitting }: Props) {
    const disabled = submitting || !value.trim()

    return (
        <View style={styles.commentInputBox}>
            <TextInput
                style={styles.commentInput}
                placeholder="Escreva um comentário..."
                placeholderTextColor="#bbb"
                value={value}
                onChangeText={onChangeText}
                multiline
                maxLength={1000}
            />
            <TouchableOpacity
                onPress={onSubmit}
                disabled={disabled}
                style={[styles.commentSendBtn, disabled && styles.commentSendBtnDisabled]}
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
        backgroundColor: colors.white,
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: '#e8e0da',
    },
    commentInput: {
        flex: 1, fontSize: 12, color: colors.primary,
        maxHeight: 100, paddingVertical: 0,
    },
    commentSendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentSendBtnDisabled: { opacity: 0.3 },
})