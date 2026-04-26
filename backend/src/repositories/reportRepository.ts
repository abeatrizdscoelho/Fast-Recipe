import prisma from "../database/prisma"

export const reportRepository = {
  async create(userId: string, commentId: string, reason: string) {
    return prisma.report.create({
      data: { userId, commentId, reason },
    })
  },

  async findByUserAndComment(userId: string, commentId: string) {
    return prisma.report.findUnique({
      where: { userId_commentId: { userId, commentId } },
    })
  },
}