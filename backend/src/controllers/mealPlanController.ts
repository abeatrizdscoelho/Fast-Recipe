import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import { mealPlanService } from '../services/mealPlanService'
import { ValidationError } from 'yup'
import { addEntrySchema, replaceEntrySchema } from '../schemas/mealPlanSchema'

function handleError(err: unknown, res: Response): Response {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message })
    }
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const mealPlanController = {
    async getWeekPlan(req: AuthRequest, res: Response) {
        try {
            const dateRef = req.query.date as string | undefined
            const result = await mealPlanService.getWeekPlan(req.userId!, dateRef)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async addEntry(req: AuthRequest, res: Response) {
        try {
            const data = await addEntrySchema.validate(req.body, { abortEarly: false })
            const dateRef = req.query.date as string | undefined
            const result = await mealPlanService.addEntry(req.userId!, data, dateRef)
            return res.status(201).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async replaceEntry(req: AuthRequest, res: Response) {
        try {
            const entryId = Array.isArray(req.params.entryId) ? req.params.entryId[0] : req.params.entryId
            const data = await replaceEntrySchema.validate(req.body, { abortEarly: false })
            const result = await mealPlanService.replaceEntry(req.userId!, entryId, data)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async removeEntry(req: AuthRequest, res: Response) {
        try {
            const entryId = Array.isArray(req.params.entryId) ? req.params.entryId[0] : req.params.entryId
            const result = await mealPlanService.removeEntry(req.userId!, entryId)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },

    async toggleCompleted(req: AuthRequest, res: Response) {
        try {
            const entryId = Array.isArray(req.params.entryId) ? req.params.entryId[0] : req.params.entryId
            const result = await mealPlanService.toggleCompleted(req.userId!, entryId)
            return res.status(200).json(result)
        } catch (err) {
            return handleError(err, res)
        }
    },
}