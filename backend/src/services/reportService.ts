import prisma from "../database/prisma"
import { reportRepository } from "../repositories/reportRepository"
import { reviewRepository } from "../repositories/reviewRepository"

export const reportService = {
  async reportComment(userId: string, commentId: string) {
    const comment = await reviewRepository.findCommentById(commentId)
    if (!comment) throw new Error('Comentário não encontrado.')

    if (comment.userId === userId) {
      throw new Error('Você não pode denunciar o próprio comentário.')
    }

    const existing = await reportRepository.findByUserAndComment(userId, commentId)
    if (existing) throw new Error('Você já denunciou este comentário.')

    await reportRepository.create(userId, commentId)

    const newCount = comment.reportCount + 1
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        reportCount: newCount, hidden: newCount >= 5,
      },
    })
  },
}