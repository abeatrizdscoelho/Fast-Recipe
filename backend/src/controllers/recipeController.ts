import { Response } from 'express'
import { ValidationError } from 'yup'
import { AuthRequest } from '../middlewares/authMiddleware'
import { recipeService } from '../services/recipeService'
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipeSchema'

function handleError(err: unknown, res: Response): Response {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const recipeController = {
  async create(req: AuthRequest, res: Response) {
    try {
      if (req.body.ingredients && typeof req.body.ingredients === 'string') {
        req.body.ingredients = JSON.parse(req.body.ingredients)
      }
      const data = await createRecipeSchema.validate(req.body, { abortEarly: false })
      const photoBuffer = (req.files as Express.Multer.File[])?.map(f => f.buffer)
      const result = await recipeService.create(req.userId!, data, photoBuffer)
      return res.status(201).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getMyRecipes(req: AuthRequest, res: Response) {
    try {
      const result = await recipeService.getMyRecipes(req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const result = await recipeService.getAll(page, limit)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const result = await recipeService.getById(id, req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      if (req.body.ingredients && typeof req.body.ingredients === 'string') {
        req.body.ingredients = JSON.parse(req.body.ingredients)
      }
      const data = await updateRecipeSchema.validate(req.body, { abortEarly: false })
      const photoBuffer = (req.files as Express.Multer.File[])?.map(f => f.buffer)
      const result = await recipeService.update(id, req.userId!, data, photoBuffer)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await recipeService.delete(id, req.userId!)
      return res.status(204).send()
    } catch (err) {
      return handleError(err, res)
    }
  },
}