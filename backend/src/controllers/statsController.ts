import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { statsService } from '../services/statsService'

function handleError(err: unknown, res: Response): Response {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const statsController = {
  async getStats(req: AuthRequest, res: Response) {
    try {
      const result = await statsService.getStats(req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async registerCooked(req: AuthRequest, res: Response) {
    try {
      const recipeId = Array.isArray(req.params.recipeId)
        ? req.params.recipeId[0]
        : req.params.recipeId
      await statsService.registerCooked(req.userId!, recipeId)
      return res.status(201).json({ registered: true })
    } catch (err) {
      return handleError(err, res)
    }
  },
}