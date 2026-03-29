import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { favoriteService } from '../services/favoriteService'

function handleError(err: unknown, res: Response): Response {
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const favoriteController = {
    async toggle(req: AuthRequest, res: Response) {
        try {
            const recipeId = Array.isArray(req.params.recipeId) ? req.params.recipeId[0] : req.params.recipeId
            const result = await favoriteService.toggle(req.userId!, recipeId)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async getFavorites(req: AuthRequest, res: Response) {
        try {
            const result = await favoriteService.getFavorites(req.userId!)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },
}