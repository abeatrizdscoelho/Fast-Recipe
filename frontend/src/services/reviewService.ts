import axios from 'axios'
import { api } from './api'
import { RecipeRatingDTO, ReviewResponseDTO, CommentResponseDTO, CommentsListDTO } from '../types/review'

export const reviewService = {
  async upsertReview(recipeId: string, rating: number): Promise<ReviewResponseDTO> {
    try {
      const response = await api.post(`/recipes/${recipeId}/reviews`, { rating })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao registrar avaliação')
      }
      throw new Error('Erro inesperado')
    }
  },

  async getRating(recipeId: string): Promise<RecipeRatingDTO> {
    try {
      const response = await api.get(`/recipes/${recipeId}/reviews`)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao buscar avaliação')
      }
      throw new Error('Erro inesperado')
    }
  },

  async getComments(recipeId: string): Promise<CommentsListDTO> {
    try {
      const response = await api.get(`/recipes/${recipeId}/comments`)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao buscar comentários')
      }
      throw new Error('Erro inesperado')
    }
  },

  async createComment(recipeId: string, text: string): Promise<CommentResponseDTO> {
    try {
      const response = await api.post(`/recipes/${recipeId}/comments`, { text })
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao criar comentário')
      }
      throw new Error('Erro inesperado')
    }
  },

  async updateComment(commentId: string, text: string): Promise<CommentResponseDTO> {
    try {
      const response = await api.put(`/recipes/comments/${commentId}`, { text }) 
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao editar comentário')
      }
      throw new Error('Erro inesperado')
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      await api.delete(`/recipes/comments/${commentId}`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao excluir comentário')
      }
      throw new Error('Erro inesperado')
    }
  },
}