import prisma from "../database/prisma";

export const reviewRepository = {
  async upsertReview(userId: string, recipeId: string, rating: number) {
    return prisma.review.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      update: { rating },
      create: { userId, recipeId, rating },
    })
  },

  async findReviewByUser(userId: string, recipeId: string) {
    return prisma.review.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    })
  },

  async getAggregateRating(recipeId: string): Promise<{ average: number; count: number }> {
    const agg = await prisma.review.aggregate({
      where: { recipeId },
      _avg: { rating: true },
      _count: { rating: true },
    })
    return {
      average: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
      count: agg._count.rating,
    }
  },

  async createComment(userId: string, recipeId: string, text: string) {
    return prisma.comment.create({
      data: { userId, recipeId, text },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  },

  async findCommentById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  },

  async updateComment(id: string, text: string) {
    return prisma.comment.update({
      where: { id },
      data: { text },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  },

  async deleteComment(id: string) {
    return prisma.comment.delete({ where: { id } })
  },

  async findCommentsByRecipe(recipeId: string) {
    return prisma.comment.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' }, 
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  },
}