import { Request, Response } from 'express';
import { ValidationError } from 'yup';
import { authService } from '../services/authService';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/authSchema';

function handleError(err: unknown, res: Response): Response {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Erro interno do servidor' })
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const data = await registerSchema.validate(req.body)
      const result = await authService.register(data)
      return res.status(201).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = await loginSchema.validate(req.body)
      const result = await authService.login(data)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const data = await forgotPasswordSchema.validate(req.body)
      try {
        await authService.forgotPassword(data)
      } catch {}
      return res.status(200).json({message: 'Se o e-mail estiver cadastrado, você receberá as instruções.'})
    } catch (err) {
      return handleError(err, res)
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const data = await resetPasswordSchema.validate(req.body)
      const result = await authService.resetPassword(data)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  },

  redirectResetPassword(req: Request, res: Response) {
    const { token } = req.query
    if (!token || typeof token !== 'string') {
      return res.status(400).send('Token inválido')
    }
    // return res.redirect(`fastrecipe://reset-password?token=${token}`)
    return res.redirect(`exp://192.168.0.10:8081/--/(auth)/reset-password?token=${token}`)
  },
}