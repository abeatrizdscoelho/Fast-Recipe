import { Response } from 'express'
import { AuthRequest } from "../middlewares/authMiddleware"
import { reportService } from "../services/reportService"

export const reportController = {
  async reportComment(req: AuthRequest, res: Response) {
    try {
      const commentId = Array.isArray(req.params.commentId)
        ? req.params.commentId[0] : req.params.commentId

      await reportService.reportComment(req.userId!, commentId)
      return res.status(201).json({ message: 'Denúncia registrada com sucesso.' })
    } catch (err) {
      if (err instanceof Error) return res.status(400).json({ error: err.message })
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },
}