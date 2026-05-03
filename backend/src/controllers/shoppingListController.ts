import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { shoppingListService } from '../services/shoppingListService'
import { ValidationError } from 'yup'

function handleError(err: unknown, res: Response): Response {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message })
    }
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const shoppingListController = {
    async getShoppingList(req: AuthRequest, res: Response) {
        try {
            const dateRef = req.query.date as string | undefined
            const result = await shoppingListService.getShoppingList(req.userId!, dateRef)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async toggleBought(req: AuthRequest, res: Response) {
        try {
            const { ingredientIds, bought } = req.body

            if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
                return res.status(400).json({ error: 'ingredientIds deve ser um array não vazio' })
            }

            if (typeof bought !== 'boolean') {
                return res.status(400).json({ error: 'bought deve ser um booleano' })
            }

            await shoppingListService.toggleBought(req.userId!, ingredientIds, bought)
            return res.status(204).send()
        } catch (err) {
            return handleError(err, res)
        }
    },
}