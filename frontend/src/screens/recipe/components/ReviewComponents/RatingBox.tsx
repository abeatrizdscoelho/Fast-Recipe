import React from 'react'
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/src/theme/color'
import { StarRow } from './StarRow'
import { CommentInput } from './CommentInput'

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
    return (
        <View style={styles.ratingBox}>
            <View style={styles.ratingBoxHeader}>
                {userAvatarUrl ? (
                    <Image source={{ uri: userAvatarUrl }} style={styles.ratingBoxAvatar} />
                ) : (
                    <View style={styles.ratingBoxAvatar}>
                        {userInitials ? (
                            <Text style={styles.ratingBoxInitials}>{userInitials}</Text>
                        ) : (
                            <Ionicons name="person-outline" size={20} color={colors.primary} />
                        )}
                    </View>
                )}
                <View style={styles.ratingBoxContent}>
                    <Text style={styles.ratingBoxPrompt}>
                        {userRating ? 'Sua avaliação' : 'Gostou da receita?'}
                    </Text>
                    <Text style={styles.ratingBoxSub}>
                        {userRating
                            ? 'Toque nas estrelas para alterar.'
                            : 'Avalie ou deixe seu comentário.'}
                    </Text>
                    {submitting ? (
                        <ActivityIndicator size="small" color={colors.primary} />
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
        gap: 12, backgroundColor: '#faf8f6',
        borderRadius: 16, padding: 14, marginBottom: 20,
    },
    ratingBoxHeader: { flexDirection: 'row', gap: 12 },
    ratingBoxAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#e8e0da',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    },
    ratingBoxInitials: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    ratingBoxContent: { flex: 1, gap: 6 },
    ratingBoxPrompt: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    ratingBoxSub: { fontSize: 12, color: '#888' },
})