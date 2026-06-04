import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { CommentDTO } from '@/src/types/review'
import { reviewService } from '@/src/services/reviewService'
import { reportService } from '@/src/services/reportService'
import { useTranslation } from 'react-i18next'

export function useRecipeComments(id: string) {
    const { t } = useTranslation()
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
                Alert.alert(t('common.errorTitle'), t('recipeComments.loadError'))
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
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeComments.submitError'))
        } finally {
            setSubmittingComment(false)
        }
    }, [id, commentText, submittingComment, t])

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
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeComments.editError'))
        }
    }, [editingCommentId, editingText, t])

    const confirmDeleteComment = useCallback((commentId: string) => {
        Alert.alert(
            t('recipeComments.deleteTitle'),
            t('recipeComments.deleteMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('recipeComments.deleteAction'), style: 'destructive',
                    onPress: async () => {
                        try {
                            await reviewService.deleteComment(commentId)
                            setComments(prev => prev.filter(c => c.id !== commentId))
                        } catch (err) {
                            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeComments.deleteError'))
                        }
                    },
                },
            ]
        )
    }, [t])

    const confirmReport = useCallback(async () => {
        if (!reportingCommentId) return
        try {
            await reportService.reportComment(reportingCommentId)
            Alert.alert(t('common.successTitle'), t('recipeComments.reportSuccessMessage'))
        } catch (err) {
            Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeComments.reportError'))
        } finally {
            setReportingCommentId(null)
        }
    }, [reportingCommentId, t])

    return {
        comments, commentText, setCommentText,
        submittingComment, loading, submitComment,
        editingCommentId, editingText, setEditingText,
        startEditComment, cancelEditComment, saveEditComment,
        confirmDeleteComment,
        reportingCommentId, setReportingCommentId, confirmReport,
    }
}