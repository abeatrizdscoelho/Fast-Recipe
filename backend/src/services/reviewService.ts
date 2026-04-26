import { CommentDTO } from "../models/reviewDTO"
import { recipeRepository } from "../repositories/recipeRepository"
import { reviewRepository } from "../repositories/reviewRepository"

function toCommentDTO(
  comment: {
    id: string
    text: string
    userId: string
    recipeId: string
    createdAt: Date
    updatedAt: Date
    user: { id: string; name: string; avatarUrl: string | null }
  },
  requesterId: string
): CommentDTO {
  return {
    id: comment.id,
    text: comment.text,
    userId: comment.userId,
    recipeId: comment.recipeId,
    author: comment.user,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    isEdited: comment.updatedAt.getTime() - comment.createdAt.getTime() > 1000,
    isOwner: comment.userId === requesterId,
  }
}

export const reviewService = {
  async upsertReview(userId: string, recipeId: string, rating: number) {
    if (rating < 1 || rating > 5) {
      throw new Error('A avaliação deve ser entre 1 e 5 estrelas.')
    }

    const recipe = await recipeRepository.findById(recipeId)
    if (!recipe) throw new Error('Receita não encontrada.')

    if (recipe.authorId === userId) {
      throw new Error('Você não pode avaliar a sua própria receita.')
    }

    const review = await reviewRepository.upsertReview(userId, recipeId, rating)
    const agg = await reviewRepository.getAggregateRating(recipeId)

    return {
      review: {
        id: review.id,
        rating: review.rating,
        userId: review.userId,
        recipeId: review.recipeId,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      },
      average: agg.average,
      count: agg.count,
    }
  },

  async getRating(userId: string, recipeId: string) {
    const [agg, userReview] = await Promise.all([
      reviewRepository.getAggregateRating(recipeId),
      reviewRepository.findReviewByUser(userId, recipeId),
    ])

    const recipe = await recipeRepository.findById(recipeId)
    const isAuthor = recipe?.authorId === userId

    return {
      average: agg.average, count: agg.count,
      userRating: isAuthor ? null : (userReview?.rating ?? null),
    }
  },

  async createComment(userId: string, recipeId: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) throw new Error('O comentário não pode estar vazio.')
    if (trimmed.length > 1000) throw new Error('Comentário muito longo (máximo 1000 caracteres).')

    const recipe = await recipeRepository.findById(recipeId)
    if (!recipe) throw new Error('Receita não encontrada.')

    const comment = await reviewRepository.createComment(userId, recipeId, trimmed)
    return { comment: toCommentDTO(comment, userId) }
  },

  async updateComment(userId: string, commentId: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) throw new Error('O comentário não pode estar vazio.')
    if (trimmed.length > 1000) throw new Error('Comentário muito longo (máximo 1000 caracteres).')

    const existing = await reviewRepository.findCommentById(commentId)
    if (!existing) throw new Error('Comentário não encontrado.')

    if (existing.userId !== userId) {
      throw new Error('Você não tem permissão para editar este comentário.')
    }

    const comment = await reviewRepository.updateComment(commentId, trimmed)
    return { comment: toCommentDTO(comment, userId) }
  },

  async deleteComment(userId: string, commentId: string) {
    const existing = await reviewRepository.findCommentById(commentId)
    if (!existing) throw new Error('Comentário não encontrado.')

    if (existing.userId !== userId) {
      throw new Error('Você não tem permissão para excluir este comentário.')
    }

    await reviewRepository.deleteComment(commentId)
  },

  async getComments(userId: string, recipeId: string) {
    const recipe = await recipeRepository.findById(recipeId)
    if (!recipe) throw new Error('Receita não encontrada.')

    const comments = await reviewRepository.findCommentsByRecipe(recipeId)
    return {
      comments: comments.map(c => toCommentDTO(c, userId)),
    }
  },
}