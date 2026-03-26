import prisma from '../database/prisma';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    })
  },

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data })
  },

  async updateResetToken(id: string, token: string | null, expires: Date | null) {
    return prisma.user.update({
      where: { id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    })
  },

  async updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: {
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })
  },
}