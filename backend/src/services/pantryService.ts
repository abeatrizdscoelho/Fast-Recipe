import { pantryRepository } from '../repositories/pantryRepository'
import { PantryItemDTO, PantryItemResponseDTO, PantryListResponseDTO, PantrySuggestionsResponseDTO, CreatePantryItemDTO, UpdatePantryItemDTO } from '../models/pantryDTO'

function formatItem(item: {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiresAt: Date | null
  createdAt: Date
}): PantryItemDTO {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    category: item.category,
    expiresAt: item.expiresAt ? item.expiresAt.toISOString() : null,
    createdAt: item.createdAt.toISOString(),
  }
}

export const pantryService = {
  async getItems(userId: string): Promise<PantryListResponseDTO> {
    const items = await pantryRepository.findByUser(userId)
    return { items: items.map(formatItem) }
  },

  async addItem(userId: string, data: CreatePantryItemDTO): Promise<PantryItemResponseDTO> {
    const item = await pantryRepository.create(userId, {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    })
    return { item: formatItem(item) }
  },

  async updateItem(id: string, userId: string, data: UpdatePantryItemDTO): Promise<PantryItemResponseDTO> {
    const existing = await pantryRepository.findById(id, userId)
    if (!existing) throw new Error('Item não encontrado')

    const item = await pantryRepository.update(id, userId, {
      ...data,
      expiresAt: data.expiresAt === null ? null : data.expiresAt ? new Date(data.expiresAt) : undefined,
    })
    return { item: formatItem(item) }
  },

  async deleteItem(id: string, userId: string): Promise<void> {
    const existing = await pantryRepository.findById(id, userId)
    if (!existing) throw new Error('Item não encontrado')
    await pantryRepository.delete(id, userId)
  },

  async getSuggestions(userId: string): Promise<PantrySuggestionsResponseDTO> {
    const recipes = await pantryRepository.findRecipeSuggestions(userId)

    if (recipes.length === 0) {
      return {
        suggestions: [],
        message: 'Nenhuma receita encontrada com os ingredientes da sua despensa. Adicione mais ingredientes para receber sugestões.',
      }
    }

    return {
      suggestions: recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        time: recipe.time,
        difficulty: recipe.difficulty,
        description: recipe.description,
        photos: recipe.photos,
        category: recipe.category,
        favorite: recipe.favorite,
        authorId: recipe.authorId,
        author: {
          id: recipe.author.id,
          name: recipe.author.name,
          avatarUrl: recipe.author.avatarUrl ?? null,
        },
        matchCount: recipe.matchCount,
        matchPercentage: recipe.matchPercentage,
        createdAt: recipe.createdAt.toISOString(),
      })),
    }
  },
}