import prisma from '../database/prisma'

export const recipeRepository = {
  async create(data: {
    title: string
    ingredients: string[]
    preparation: string
    time: string
    portions: string
    category: string
    difficulty?: string
    description?: string
    photos?: string[]
    authorId: string
  }) {
    return prisma.recipe.create({ data })
  },

  async findById(id: string) {
    return prisma.recipe.findUnique({ where: { id } })
  },

  async findByAuthor(authorId: string) {
    return prisma.recipe.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findAll() {
    return prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async update(id: string, data: {
    title?: string
    ingredients?: string[]
    preparation?: string
    time?: string
    portions?: string
    category?: string
    difficulty?: string
    description?: string
    photos?: string[]
  }) {
    return prisma.recipe.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.recipe.delete({ where: { id } })
  },
}