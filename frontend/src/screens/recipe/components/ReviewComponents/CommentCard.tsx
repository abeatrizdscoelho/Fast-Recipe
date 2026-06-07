import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommentDTO } from '@/src/types/review'
import { colors } from '@/src/theme/color'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
    comment: CommentDTO
    editingCommentId: string | null
    editingText: string
    setEditingText: (t: string) => void
    onStartEdit: (c: CommentDTO) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onDelete: (id: string) => void
    onReport: (id: string) => void
}

export function CommentCard({
    comment, editingCommentId, editingText, setEditingText,
    onStartEdit, onSaveEdit, onCancelEdit, onDelete, onReport
}: Props) {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const isEditing = editingCommentId === comment.id
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
    const formattedEdit = comment.isEdited
        ? new Date(comment.updatedAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
        }) : null

    const dynStyles = StyleSheet.create({
        reviewCard: { borderTopColor: theme.divider },
        reviewAvatar: { backgroundColor: theme.surfaceSecondary },
        reviewName: { color: theme.primary },
        reviewTime: { color: theme.textMuted },
        reviewEdited: { color: theme.textMuted },
        reviewText: { color: theme.textPrimary },
        editInput: { borderColor: theme.border, color: theme.primary },
        editCancelBtn: { borderColor: theme.border },
        editCancelText: { color: theme.textMuted },
        editSaveBtn: { backgroundColor: theme.primary },
    })

    return (
        <View style={[styles.reviewCard, dynStyles.reviewCard]}>
            <View style={styles.reviewHeader}>
                {comment.author.avatarUrl ? (
                    <Image source={{ uri: comment.author.avatarUrl }} style={styles.reviewAvatar} />
                ) : (
                    <View style={[styles.reviewAvatar, dynStyles.reviewAvatar]}>
                        <Ionicons name="person-outline" size={18} color={theme.primary} />
                    </View>
                )}

                <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.reviewMeta}>
                        <Text style={[styles.reviewName, dynStyles.reviewName]}>{comment.author.name}</Text>
                        <Text style={[styles.reviewTime, dynStyles.reviewTime]}>{formattedDate}</Text>
                    </View>
                    {formattedEdit && (
                        <Text style={[styles.reviewEdited, dynStyles.reviewEdited]}>{t('commentCard.editedOn', { date: formattedEdit })}</Text>
                    )}

                    {isEditing ? (
                        <View style={styles.editBox}>
                            <TextInput
                                style={[styles.editInput, dynStyles.editInput]}
                                value={editingText}
                                onChangeText={setEditingText}
                                multiline
                                autoFocus
                                maxLength={1000}
                                placeholderTextColor={theme.textMuted}
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={onCancelEdit} style={[styles.editCancelBtn, dynStyles.editCancelBtn]}>
                                    <Text style={[styles.editCancelText, dynStyles.editCancelText]}>{t('commentCard.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onSaveEdit} style={[styles.editSaveBtn, dynStyles.editSaveBtn]}>
                                    <Text style={styles.editSaveText}>{t('commentCard.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text style={[styles.reviewText, dynStyles.reviewText]}>{comment.text}</Text>
                    )}
                </View>

                {!isEditing && (
                    <View style={styles.commentActions}>
                        {comment.isOwner ? (
                            <>
                                <TouchableOpacity onPress={() => onStartEdit(comment)} style={styles.commentActionBtn}>
                                    <Ionicons name="pencil-outline" size={15} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(comment.id)} style={styles.commentActionBtn}>
                                    <Ionicons name="trash-outline" size={15} color="#e05c5c" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => onReport(comment.id)} style={styles.commentActionBtn}>
                                <Ionicons name="flag-outline" size={15} color={theme.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    reviewCard: {
        paddingVertical: 14,
        borderTopWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10
    },
    reviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2
    },
    reviewName: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    reviewTime: {
        fontSize: 11
    },
    reviewEdited: {
        fontSize: 10,
        fontStyle: 'italic'
    },
    reviewText: {
        fontSize: 13,
        lineHeight: 20
    },
    commentActions: {
        flexDirection: 'row',
        gap: 4
    },
    commentActionBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBox: {
        gap: 8
    },
    editInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        minHeight: 60,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8
    },
    editCancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    editCancelText: {
        fontSize: 12
    },
    editSaveBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
    },
    editSaveText: {
        fontSize: 12,
        color: colors.white,
        fontWeight: 'bold'
    },
})