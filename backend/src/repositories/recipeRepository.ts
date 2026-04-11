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

  async findById(id: string, userId?: string) {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        favorites: userId ? {
          where: { userId },
          select: { id: true },
        } : false,
      },
    })
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

  async findAll(page: number, limit: number, userId: string, search?: string) {
    const skip = (page - 1) * limit

    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

    const allRecipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        favorites: { where: { userId }, select: { id: true } },
      },
    })

    const filtered = search ? allRecipes.filter(r => {
        const term = normalize(search)
        return (
          normalize(r.title).includes(term) ||
          normalize(r.description ?? '').includes(term) ||
          r.ingredients.some(i => normalize(i).includes(term))
        )
      }) : allRecipes

    const total = filtered.length
    const paginated = filtered.slice(skip, skip + limit)

    return {
      recipes: paginated.map(r => ({ ...r, favorite: r.favorites.length > 0 })),
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