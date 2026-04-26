import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { FeedRecipe } from '@/src/types/recipe'
import { CommentDTO } from '@/src/types/review'
import { recipeService } from '@/src/services/recipeService'
import { reviewService } from '@/src/services/reviewService'
import { favoriteService } from '@/src/services/favoriteService'
import { reportService } from '@/src/services/reportService'
import { useAuth } from '@/src/context/AuthContext'

export function useRecipeDetail(id: string) {
  const { user } = useAuth()

  // ─── Receita ───────────────────────────────────────────────
  const [recipe, setRecipe] = useState<FeedRecipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [togglingFavorite, setTogglingFavorite] = useState(false)

  // ─── Avaliação ─────────────────────────────────────────────
  const [ratingAverage, setRatingAverage] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isAuthor, setIsAuthor] = useState(false)
  const [submittingRating, setSubmittingRating] = useState(false)

  // ─── Comentários ───────────────────────────────────────────
  const [comments, setComments] = useState<CommentDTO[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  // ─── Denúncia ──────────────────────────────────────────────
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null)

  // ─── Carregamento inicial ──────────────────────────────────
  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const [recipeData, ratingData, commentsData] = await Promise.all([
          recipeService.getById(id),
          reviewService.getRating(id),
          reviewService.getComments(id),
        ])
        setRecipe(recipeData.recipe as unknown as FeedRecipe)
        setRatingAverage(ratingData.average)
        setRatingCount(ratingData.count)
        setUserRating(ratingData.userRating)
        setIsAuthor(ratingData.userRating === null &&
          recipeData.recipe.authorId === recipeData.recipe.author?.id ? false : false
        )
        setComments(commentsData.comments)
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar a receita.')
        router.back()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ─── Favorito ──────────────────────────────────────────────
  async function toggleFavorite() {
    if (!recipe || togglingFavorite) return
    setTogglingFavorite(true)
    setRecipe(prev => prev ? { ...prev, favorite: !prev.favorite } : prev)
    try {
      await favoriteService.toggle(recipe.id)
    } catch {
      setRecipe(prev => prev ? { ...prev, favorite: !prev.favorite } : prev)
      Alert.alert('Erro', 'Não foi possível salvar o favorito.')
    } finally {
      setTogglingFavorite(false)
    }
  }

  // ─── Avaliação ─────────────────────────────────────────────
  const submitRating = useCallback(async (rating: number) => {
    if (submittingRating) return
    setSubmittingRating(true)
    const previous = userRating
    setUserRating(rating)
    try {
      const result = await reviewService.upsertReview(id, rating)
      setRatingAverage(result.average)
      setRatingCount(result.count)
    } catch (err) {
      setUserRating(previous)
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível registrar a avaliação.')
    } finally {
      setSubmittingRating(false)
    }
  }, [id, submittingRating, userRating])

  // ─── Comentários ───────────────────────────────────────────
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
        {
          text: 'Excluir', style: 'destructive',
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

  // ─── Denúncia ──────────────────────────────────────────────
  const confirmReport = useCallback(async (reason: string) => {
    if (!reportingCommentId) return
    try {
      await reportService.reportComment(reportingCommentId, reason)
      Alert.alert('Denúncia enviada', 'Obrigado! Vamos analisar o comentário.')
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível enviar a denúncia.')
    } finally {
      setReportingCommentId(null)
    }
  }, [reportingCommentId])

  // ─── Derivados ─────────────────────────────────────────────
  const photos = recipe?.photos ?? []
  const authorInitials = recipe?.author?.name
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?'
  const userInitials = user?.name
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? ''
  const userAvatarUrl = user?.avatarUrl ?? null

  return {
    // Receita
    recipe, loading, activePhoto, setActivePhoto,
    photos, authorInitials, toggleFavorite,

    // Usuário logado
    userInitials, userAvatarUrl,

    // Avaliação
    ratingAverage, ratingCount, userRating, isAuthor,
    submittingRating, submitRating,

    // Comentários
    comments, commentText, setCommentText,
    submittingComment, submitComment,
    editingCommentId, editingText, setEditingText,
    startEditComment, cancelEditComment, saveEditComment,
    confirmDeleteComment,

    // Denúncia
    reportingCommentId, setReportingCommentId, confirmReport,
  }
}