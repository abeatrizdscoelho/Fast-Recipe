import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { reviewService } from '../services/reviewService'

function handleError(err: unknown, res: Response): Response {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const reviewController = {
  async upsertReview(req: AuthRequest, res: Response) {
    try {
      const recipeId = Array.isArray(req.params.recipeId) ? req.params.recipeId[0] : req.params.recipeId
      const rating = Number(req.body.rating)
      if (!Number.isInteger(rating)) {
        return res.status(400).json({ error: 'Nota inválida.' })
      }
      const result = await reviewService.upsertReview(req.userId!, recipeId, rating)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getRating(req: AuthRequest, res: Response) {
    try {
      const recipeId = Array.isArray(req.params.recipeId) ? req.params.recipeId[0] : req.params.recipeId
      const result = await reviewService.getRating(req.userId!, recipeId)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async createComment(req: AuthRequest, res: Response) {
    try {
      const recipeId = Array.isArray(req.params.recipeId) ? req.params.recipeId[0] : req.params.recipeId
      const { text } = req.body
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texto do comentário é obrigatório.' })
      }
      const result = await reviewService.createComment(req.userId!, recipeId, text)
      return res.status(201).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async updateComment(req: AuthRequest, res: Response) {
    try {
      const commentId = Array.isArray(req.params.commentId) ? req.params.commentId[0] : req.params.commentId
      const { text } = req.body
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texto do comentário é obrigatório.' })
      }
      const result = await reviewService.updateComment(req.userId!, commentId, text)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async deleteComment(req: AuthRequest, res: Response) {
    try {
      const commentId = Array.isArray(req.params.commentId) ? req.params.commentId[0] : req.params.commentId
      await reviewService.deleteComment(req.userId!, commentId)
      return res.status(204).send()
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getComments(req: AuthRequest, res: Response) {
    try {
      const recipeId = Array.isArray(req.params.recipeId) ? req.params.recipeId[0] : req.params.recipeId
      const result = await reviewService.getComments(req.userId!, recipeId)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },
}