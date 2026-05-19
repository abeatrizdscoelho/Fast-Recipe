import prisma from '../database/prisma'

const pantryItemSelect = {
  id: true,
  name: true,
  quantity: true,
  unit: true,
  category: true,
  expiresAt: true,
  createdAt: true,
}

export const pantryRepository = {
  async findByUser(userId: string) {
    return prisma.pantryItem.findMany({
      where: { userId },
      select: pantryItemSelect,
      orderBy: { createdAt: 'asc' },
    })
  },

  async findById(id: string, userId: string) {
    return prisma.pantryItem.findFirst({
      where: { id, userId },
      select: pantryItemSelect,
    })
  },

  async create(userId: string, data: {
    name: string
    quantity: number
    unit: string
    category?: string
    expiresAt?: Date | null
  }) {
    return prisma.pantryItem.create({
      data: {
        userId,
        ...data,
        category: data.category ?? 'Outros',
      },
      select: pantryItemSelect,
    })
  },

  async update(id: string, userId: string, data: {
    name?: string
    quantity?: number
    unit?: string
    category?: string
    expiresAt?: Date | null
  }) {
    return prisma.pantryItem.update({
      where: { id, userId },
      data,
      select: pantryItemSelect,
    })
  },

  async delete(id: string, userId: string) {
    return prisma.pantryItem.delete({
      where: { id, userId },
    })
  },

  async findRecipeSuggestions(userId: string) {
    const pantryItems = await prisma.pantryItem.findMany({
      where: { userId },
      select: { name: true },
    })

    if (pantryItems.length === 0) return []

    const pantryNames = pantryItems.map(i =>
      i.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    )

    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: { select: { name: true } },
        author: { select: { id: true, name: true, avatarUrl: true } },
        favorites: { where: { userId }, select: { id: true } },
      },
    })

    const scored = recipes
      .map(recipe => {
        const matched = recipe.ingredients.filter(ingredient => {
          const normalized = ingredient.name
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
          return pantryNames.some(p => normalized.includes(p) || p.includes(normalized))
        })

        return {
          ...recipe,
          favorite: recipe.favorites.length > 0,
          matchCount: matched.length,
          matchPercentage: Math.round((matched.length / recipe.ingredients.length) * 100),
        }
      })
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)

    return scored
  },
}