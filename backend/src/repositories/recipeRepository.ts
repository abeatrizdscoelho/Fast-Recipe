import prisma from '../database/prisma'
import { CreateIngredientDTO } from '../models/recipeDTO'

const ingredientSelect = {
  id: true,
  name: true,
  quantity: true,
  unit: true,
  category: true,
}

const recipeInclude = {
  ingredients: { select: ingredientSelect },
  author: { select: { id: true, name: true, avatarUrl: true } },
}

export const recipeRepository = {
  async create(data: {
    title: string
    ingredients: CreateIngredientDTO[]
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
    const { ingredients, ...recipeData } = data

    return prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: {
          create: ingredients.map(i => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            category: i.category ?? 'Outros',
          })),
        },
      },
      include: recipeInclude,
    })
  },

  async findById(id: string, userId?: string) {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        ...recipeInclude,
        favorites: userId
          ? { where: { userId }, select: { id: true } }
          : false,
      },
    })
  },

  async findByAuthor(authorId: string, userId: string) {
    const recipes = await prisma.recipe.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        ...recipeInclude,
        favorites: { where: { userId }, select: { id: true } },
      },
    })
    return recipes.map(r => ({ ...r, favorite: r.favorites.length > 0 }))
  },

  async findAll(
    page: number,
    limit: number,
    userId: string,
    search?: string,
    categories?: string[],
    dietaryRestrictions?: string[]
  ) {
    const skip = (page - 1) * limit
    const normalize = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

    const allRecipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        ...recipeInclude,
        favorites: { where: { userId }, select: { id: true } },
      },
    })

    const filtered = allRecipes.filter(r => {
      if (search) {
        const term = normalize(search)
        const matchesSearch =
          normalize(r.title).includes(term) ||
          normalize(r.description ?? '').includes(term) ||
          r.ingredients.some(i => normalize(i.name).includes(term))
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

  async update(
    id: string,
    data: {
      title?: string
      ingredients?: CreateIngredientDTO[]
      preparation?: string
      time?: string
      portions?: string
      category?: string
      difficulty?: string
      description?: string
      photos?: string[]
      dietaryRestrictions?: string[]
    }
  ) {
    const { ingredients, ...recipeData } = data

    if (ingredients) {
      await prisma.ingredient.deleteMany({ where: { recipeId: id } })
    }

    return prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        ...(ingredients && {
          ingredients: {
            create: ingredients.map(i => ({
              name: i.name,
              quantity: i.quantity,
              unit: i.unit,
              category: i.category ?? 'Outros',
            })),
          },
        }),
      },
      include: recipeInclude,
    })
  },

  async delete(id: string) {
    return prisma.recipe.delete({ where: { id } })
  },
}