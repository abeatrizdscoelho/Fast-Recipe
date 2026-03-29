import { recipeRepository } from '../repositories/recipeRepository'
import { uploadService } from './uploadService'
import type { CreateRecipeDTO, RecipeResponseDTO, RecipeListResponseDTO } from '../models/recipeDTO'

function formatRecipe(recipe: {
    id: string
    title: string
    ingredients: string[]
    preparation: string
    time: string
    portions: string
    category: string
    difficulty: string | null
    description: string | null
    photos: string[]
    favorite: boolean
    authorId: string
    createdAt: Date
}): RecipeResponseDTO['recipe'] {
    return {
        id: recipe.id,
        title: recipe.title,
        ingredients: recipe.ingredients,
        preparation: recipe.preparation,
        time: recipe.time,
        portions: recipe.portions,
        category: recipe.category,
        difficulty: recipe.difficulty,
        description: recipe.description,
        photos: recipe.photos,
        favorite: recipe.favorite,
        authorId: recipe.authorId,
        createdAt: recipe.createdAt.toISOString(),
    }
}

export const recipeService = {
    async create(authorId: string, data: CreateRecipeDTO, photoBuffers?: Buffer[]): Promise<RecipeResponseDTO> {
        const createData: Parameters<typeof recipeRepository.create>[0] = { ...data, authorId }

        if (photoBuffers && photoBuffers.length > 0) {
            createData.photos = await Promise.all(
                photoBuffers.map((buffer, i) =>
                    uploadService.uploadAvatar(buffer, `recipe-${Date.now()}-${i}`)
                )
            )
        }

        const recipe = await recipeRepository.create(createData)
        return { recipe: formatRecipe(recipe) }
    },

    async getById(id: string, userId: string): Promise<RecipeResponseDTO> {
        const recipe = await recipeRepository.findById(id)
        if (!recipe) throw new Error('Receita não encontrada')
        if (recipe.authorId !== userId) throw new Error('Sem permissão para acessar esta receita')
        return { recipe: formatRecipe(recipe) }
    },

    async getMyRecipes(authorId: string): Promise<RecipeListResponseDTO> {
        const recipes = await recipeRepository.findByAuthor(authorId)
        return { recipes: recipes.map(formatRecipe) }
    },

    async getAll(): Promise<RecipeListResponseDTO> {
        const recipes = await recipeRepository.findAll()
        return { recipes: recipes.map(formatRecipe) }
    },

    async update(id: string, userId: string, data: Partial<CreateRecipeDTO>, photoBuffers?: Buffer[]): Promise<RecipeResponseDTO> {
        const recipe = await recipeRepository.findById(id)
        if (!recipe) throw new Error('Receita não encontrada')
        if (recipe.authorId !== userId) throw new Error('Sem permissão para editar esta receita')

        const updateData: Parameters<typeof recipeRepository.update>[1] = { ...data }

        if (photoBuffers && photoBuffers.length > 0) {
            updateData.photos = await Promise.all(
                photoBuffers.map((buffer, i) =>
                    uploadService.uploadAvatar(buffer, `recipe-${id}-${i}`)
                )
            )
        }

        const updated = await recipeRepository.update(id, updateData)
        return { recipe: formatRecipe(updated) }
    },

    async delete(id: string, userId: string): Promise<void> {
        const recipe = await recipeRepository.findById(id)
        if (!recipe) throw new Error('Receita não encontrada')
        if (recipe.authorId !== userId) throw new Error('Sem permissão para excluir esta receita')
        await recipeRepository.delete(id)
    },
}