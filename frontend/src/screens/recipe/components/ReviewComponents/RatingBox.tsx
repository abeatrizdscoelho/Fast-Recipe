import React from 'react'
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { StarRow } from './StarRow'
import { CommentInput } from './CommentInput'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
    userRating: number | null
    submitting: boolean
    onRate: (r: number) => void
    commentValue: string
    onCommentChange: (t: string) => void
    onCommentSubmit: () => void
    submittingComment: boolean
    userAvatarUrl?: string | null
    userInitials?: string
}

export function RatingBox({
    userRating, submitting, onRate,
    commentValue, onCommentChange, onCommentSubmit, submittingComment,
    userAvatarUrl, userInitials,
}: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()

    const dynStyles = StyleSheet.create({
        ratingBox: { backgroundColor: theme.surfaceSecondary },
        ratingBoxAvatar: { backgroundColor: theme.surfaceSecondary },
        ratingBoxInitials: { color: theme.primary },
        ratingBoxPrompt: { color: theme.primary },
        ratingBoxSub: { color: theme.textMuted },
    })

    return (
        <View style={[styles.ratingBox, dynStyles.ratingBox]}>
            <View style={styles.ratingBoxHeader}>
                {userAvatarUrl ? (
                    <Image source={{ uri: userAvatarUrl }} style={styles.ratingBoxAvatar} />
                ) : (
                    <View style={[styles.ratingBoxAvatar, dynStyles.ratingBoxAvatar]}>
                        {userInitials ? (
                            <Text style={[styles.ratingBoxInitials, dynStyles.ratingBoxInitials]}>{userInitials}</Text>
                        ) : (
                            <Ionicons name="person-outline" size={20} color={theme.primary} />
                        )}
                    </View>
                )}
                <View style={styles.ratingBoxContent}>
                    <Text style={[styles.ratingBoxPrompt, dynStyles.ratingBoxPrompt]}>
                        {userRating ? t('ratingBox.promptRated') : t('ratingBox.promptUnrated')}
                    </Text>
                    <Text style={[styles.ratingBoxSub, dynStyles.ratingBoxSub]}>
                        {userRating ? t('ratingBox.subRated') : t('ratingBox.subUnrated')}
                    </Text>
                    {submitting ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                        <StarRow rating={userRating ?? 0} interactive size={16} onRate={onRate} />
                    )}
                </View>
            </View>

            <CommentInput
                value={commentValue}
                onChangeText={onCommentChange}
                onSubmit={onCommentSubmit}
                submitting={submittingComment}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    ratingBox: {
        gap: 12,
        borderRadius: 16,
        padding: 14,
        marginBottom: 20,
    },
    ratingBoxHeader: {
        flexDirection: 'row',
        gap: 12
    },
    ratingBoxAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    ratingBoxInitials: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    ratingBoxContent: {
        flex: 1,
        gap: 6
    },
    ratingBoxPrompt: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    ratingBoxSub: {
        fontSize: 12,
    },
})