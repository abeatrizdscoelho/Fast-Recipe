import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { CommentDTO } from '@/src/types/review'
import { reviewService } from '@/src/services/reviewService'
import { reportService } from '@/src/services/reportService'

export function useRecipeComments(id: string) {
    const [comments, setComments] = useState<CommentDTO[]>([])
    const [commentText, setCommentText] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')
    const [reportingCommentId, setReportingCommentId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        async function load() {
            try {
                const commentsData = await reviewService.getComments(id)
                setComments(commentsData.comments)
            } catch {
                Alert.alert('Erro', 'Não foi possível carregar os comentários.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    const submitComment = useCallback(async () => {
        const text = commentText.trim()
        if (!text || submittingComment) return
        setSubmittingComment(true)
        try {
            const result = await reviewService.createComment(id, text)
            setComments(prev => [result.comment, ...prev])
            setCommentText('')
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível enviar o comentário.')
        } finally {
            setSubmittingComment(false)
        }
    }, [id, commentText, submittingComment])

    const startEditComment = useCallback((comment: CommentDTO) => {
        setEditingCommentId(comment.id)
        setEditingText(comment.text)
    }, [])

    const cancelEditComment = useCallback(() => {
        setEditingCommentId(null)
        setEditingText('')
    }, [])

    const saveEditComment = useCallback(async () => {
        if (!editingCommentId) return
        const text = editingText.trim()
        if (!text) return
        try {
            const result = await reviewService.updateComment(editingCommentId, text)
            setComments(prev => prev.map(c => c.id === editingCommentId ? result.comment : c))
            setEditingCommentId(null)
            setEditingText('')
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível editar o comentário.')
        }
    }, [editingCommentId, editingText])

    const confirmDeleteComment = useCallback((commentId: string) => {
        Alert.alert(
            'Excluir comentário',
            'Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive',
                    onPress: async () => {
                        try {
                            await reviewService.deleteComment(commentId)
                            setComments(prev => prev.filter(c => c.id !== commentId))
                        } catch (err) {
                            Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível excluir o comentário.')
                        }
                    },
                },
            ]
        )
    }, [])

    const confirmReport = useCallback(async () => {
        if (!reportingCommentId) return
        try {
            await reportService.reportComment(reportingCommentId)
            Alert.alert('Sucesso', 'Sua denúncia foi registrada!')
        } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível enviar a denúncia.')
        } finally {
            setReportingCommentId(null)
        }
    }, [reportingCommentId])

    return {
        comments, commentText, setCommentText,
        submittingComment, loading, submitComment,
        editingCommentId, editingText, setEditingText,
        startEditComment, cancelEditComment, saveEditComment,
        confirmDeleteComment,
        reportingCommentId, setReportingCommentId, confirmReport,
    }
}