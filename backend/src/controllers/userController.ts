import { Response } from 'express'
import { ValidationError } from 'yup'
import { AuthRequest } from '../middlewares/authMiddleware'
import { userService } from '../services/userService'
import { updateProfileSchema } from '../schemas/userSchema'

function handleError(err: unknown, res: Response): Response {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const result = await userService.getProfile(req.userId!)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const data = await updateProfileSchema.validate(req.body, { abortEarly: false })

      // O avatar vem como buffer via multer (req.file)
      const avatarBuffer = req.file?.buffer

      const result = await userService.updateProfile(req.userId!, data, avatarBuffer)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },
}