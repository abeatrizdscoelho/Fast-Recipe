import { Response } from 'express'
import { ValidationError } from 'yup'
import { AuthRequest } from '../middlewares/authMiddleware'
import { pantryService } from '../services/pantryService'
import { createPantryItemSchema, updatePantryItemSchema } from '../schemas/pantrySchema'

function handleError(err: unknown, res: Response): Response {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const pantryController = {
  async getItems(req: AuthRequest, res: Response) {
    try {
      const result = await pantryService.getItems(req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async addItem(req: AuthRequest, res: Response) {
    try {
      const data = await createPantryItemSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true,
      })
      const result = await pantryService.addItem(req.userId!, data)
      return res.status(201).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async updateItem(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const data = await updatePantryItemSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true,
      })
      const result = await pantryService.updateItem(id, req.userId!, data)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async deleteItem(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await pantryService.deleteItem(id, req.userId!)
      return res.status(204).send()
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getSuggestions(req: AuthRequest, res: Response) {
    try {
      const result = await pantryService.getSuggestions(req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },
}