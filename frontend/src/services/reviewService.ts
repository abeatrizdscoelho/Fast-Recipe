import axios from 'axios'
import { api } from './api'
import { RecipeRatingDTO, ReviewResponseDTO, CommentResponseDTO, CommentsListDTO } from '../types/review'
import i18next from 'i18next'

export const reviewService = {
  async upsertReview(recipeId: string, rating: number): Promise<ReviewResponseDTO> {
    try {
      const response = await api.post(`/recipes/${recipeId}/reviews`, { rating })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.upsertError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async getRating(recipeId: string): Promise<RecipeRatingDTO> {
    try {
      const response = await api.get(`/recipes/${recipeId}/reviews`)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.fetchRatingError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async getComments(recipeId: string): Promise<CommentsListDTO> {
    try {
      const response = await api.get(`/recipes/${recipeId}/comments`)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.fetchCommentsError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async createComment(recipeId: string, text: string): Promise<CommentResponseDTO> {
    try {
      const response = await api.post(`/recipes/${recipeId}/comments`, { text })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.createCommentError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async updateComment(commentId: string, text: string): Promise<CommentResponseDTO> {
    try {
      const response = await api.put(`/recipes/comments/${commentId}`, { text })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.updateCommentError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      await api.delete(`/recipes/comments/${commentId}`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? i18next.t('reviewService.deleteCommentError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}