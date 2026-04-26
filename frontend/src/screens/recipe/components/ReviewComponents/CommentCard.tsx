import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommentDTO } from '@/src/types/review'
import { colors } from '@/src/theme/color'

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
    const isEditing = editingCommentId === comment.id
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
    const formattedEdit = comment.isEdited
        ? new Date(comment.updatedAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
        }) : null

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                {comment.author.avatarUrl ? (
                    <Image source={{ uri: comment.author.avatarUrl }} style={styles.reviewAvatar} />
                ) : (
                    <View style={styles.reviewAvatar}>
                        <Ionicons name="person-outline" size={18} color={colors.primary} />
                    </View>
                )}

                <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.reviewMeta}>
                        <Text style={styles.reviewName}>{comment.author.name}</Text>
                        <Text style={styles.reviewTime}>{formattedDate}</Text>
                    </View>
                    {formattedEdit && (
                        <Text style={styles.reviewEdited}>editado em {formattedEdit}</Text>
                    )}

                    {isEditing ? (
                        <View style={styles.editBox}>
                            <TextInput
                                style={styles.editInput}
                                value={editingText}
                                onChangeText={setEditingText}
                                multiline
                                autoFocus
                                maxLength={1000}
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={onCancelEdit} style={styles.editCancelBtn}>
                                    <Text style={styles.editCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onSaveEdit} style={styles.editSaveBtn}>
                                    <Text style={styles.editSaveText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.reviewText}>{comment.text}</Text>
                    )}
                </View>

                {!isEditing && (
                    <View style={styles.commentActions}>
                        {comment.isOwner ? (
                            <>
                                <TouchableOpacity onPress={() => onStartEdit(comment)} style={styles.commentActionBtn}>
                                    <Ionicons name="pencil-outline" size={15} color={colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(comment.id)} style={styles.commentActionBtn}>
                                    <Ionicons name="trash-outline" size={15} color="#e05c5c" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => onReport(comment.id)} style={styles.commentActionBtn}>
                                <Ionicons name="flag-outline" size={15} color="#aaa" />
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
        borderTopWidth: 1, borderTopColor: '#f0ebe8',
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    reviewAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#e8e0da',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    reviewName: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    reviewTime: { fontSize: 11, color: '#aaa' },
    reviewEdited: { fontSize: 10, color: '#bbb', fontStyle: 'italic' },
    reviewText: { fontSize: 13, color: '#555', lineHeight: 20 },
    commentActions: { flexDirection: 'row', gap: 4 },
    commentActionBtn: {
        width: 28, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
    },
    editBox: { gap: 8 },
    editInput: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 8,
        fontSize: 13, color: colors.primary, minHeight: 60,
    },
    editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
    editCancelBtn: {
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    },
    editCancelText: { fontSize: 12, color: '#888' },
    editSaveBtn: {
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, backgroundColor: colors.primary,
    },
    editSaveText: { fontSize: 12, color: colors.white, fontWeight: 'bold' },
})