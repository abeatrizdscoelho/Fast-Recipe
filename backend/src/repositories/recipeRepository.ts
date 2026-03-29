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

  async findByAuthor(authorId: string, userId: string) {
    const recipes = await prisma.recipe.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        favorites: {
          where: { userId },
          select: { id: true },
        },
      },
    })
    return recipes.map(r => ({
      ...r,
      favorite: r.favorites.length > 0,
    }))
  },

  async findAll(page: number, limit: number, userId: string) {
    const skip = (page - 1) * limit
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          favorites: {
            where: { userId },
            select: { id: true },
          },
        },
      }),
      prisma.recipe.count(),
    ])
    return {
      recipes: recipes.map(r => ({
        ...r,
        favorite: r.favorites.length > 0,
      })),
      total,
    }
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