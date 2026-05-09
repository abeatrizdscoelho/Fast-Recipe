import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { shoppingListService } from '../services/shoppingListService'
import { ValidationError } from 'yup'
import {
    toggleBoughtSchema,
    addItemSchema,
    updateItemSchema,
    deleteItemSchema,
} from '../schemas/shoppingListSchema'

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
            const { ingredientIds, bought } = await toggleBoughtSchema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true,
            })
            await shoppingListService.toggleBought(req.userId!, ingredientIds as string[], bought)
            return res.status(204).send()
        } catch (err) {
            return handleError(err, res)
        }
    },

    async addItem(req: AuthRequest, res: Response) {
        try {
            const data = await addItemSchema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true,
            })
            const item = await shoppingListService.addItem(req.userId!, data)
            return res.status(201).json(item)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async updateItem(req: AuthRequest, res: Response) {
        try {
            const data = await updateItemSchema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true,
            })
            const item = await shoppingListService.updateItem(req.userId!, data)
            return res.status(200).json(item)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async deleteItem(req: AuthRequest, res: Response) {
        try {
            const { ingredientIds } = await deleteItemSchema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true,
            })
            await shoppingListService.deleteItem(req.userId!, ingredientIds as string[])
            return res.status(204).send()
        } catch (err) {
            return handleError(err, res)
        }
    },
}