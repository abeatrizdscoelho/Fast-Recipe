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
    dietaryRestrictions?: string[]
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

  async findAll(
    page: number, limit: number, userId: string, search?: string, categories?: string[], dietaryRestrictions?: string[]
  ) {
    const skip = (page - 1) * limit

    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

    const allRecipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        favorites: { where: { userId }, select: { id: true } },
      },
    })

    const filtered = allRecipes.filter(r => {
      if (search) {
        const term = normalize(search)
        const matchesSearch =
          normalize(r.title).includes(term) ||
          normalize(r.description ?? '').includes(term) ||
          r.ingredients.some(i => normalize(i).includes(term))
        if (!matchesSearch) return false
      }

      if (categories && categories.length > 0) {
        if (!categories.includes(r.category)) return false
      }

      if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        const hasAll = dietaryRestrictions.every(d => r.dietaryRestrictions.includes(d))
        if (!hasAll) return false
      }

      return true
    })

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
    dietaryRestrictions?: string[]
  }) {
    return prisma.recipe.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.recipe.delete({ where: { id } })
  },
}