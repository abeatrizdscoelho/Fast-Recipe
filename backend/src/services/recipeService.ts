import { CreateRecipeDTO, FeedRecipe, FeedResponseDTO, IngredientDTO, NutritionDTO, RecipeListResponseDTO, RecipeResponseDTO, RecipeWithNutritionResponseDTO } from '../models/recipeDTO'
import { recipeRepository } from '../repositories/recipeRepository'
import { getNutritionForIngredients } from './nutritionService'
import { uploadService } from './uploadService'

function formatIngredient(ingredient: {
    id: string
    name: string
    quantity: number
    unit: string
    category: string
}): IngredientDTO {
    return {
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        category: ingredient.category,
    }
}

function formatRecipe(recipe: {
    id: string
    title: string
    ingredients: {
        id: string
        name: string
        quantity: number
        unit: string
        category: string
    }[]
    preparation: string
    time: string
    portions: string
    category: string
    dietaryRestrictions: string[]
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
        ingredients: recipe.ingredients.map(formatIngredient),
        preparation: recipe.preparation,
        time: recipe.time,
        portions: recipe.portions,
        category: recipe.category,
        dietaryRestrictions: recipe.dietaryRestrictions,
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
        const createData = { ...data, authorId }

        if (photoBuffers && photoBuffers.length > 0) {
            createData.photos = await Promise.all(
                photoBuffers.map((buffer, i) =>
                    uploadService.uploadRecipePhoto(buffer, `recipe-${Date.now()}-${i}`)
                )
            )
        }

        const recipe = await recipeRepository.create(createData)
        return { recipe: { ...formatRecipe(recipe), favorite: false } }
    },

    async getById(id: string, userId: string): Promise<RecipeWithNutritionResponseDTO> {
        const recipe = await recipeRepository.findById(id, userId)
        if (!recipe) throw new Error('Receita não encontrada')

        const nutrition = await getNutritionForIngredients(recipe.ingredients).catch(() => null)

        return {
            recipe: {
                ...formatRecipe(recipe),
                favorite: recipe.favorites ? recipe.favorites.length > 0 : false,
                author: {
                    id: recipe.author.id,
                    name: recipe.author.name,
                    avatarUrl: recipe.author.avatarUrl ?? null,
                },
                nutrition,
            } as FeedRecipe & { nutrition: NutritionDTO | null },
        }
    },

    async getMyRecipes(authorId: string): Promise<RecipeListResponseDTO> {
        const recipes = await recipeRepository.findByAuthor(authorId, authorId)
        return { recipes: recipes.map(formatRecipe) }
    },

    async getAll(
        page: number, limit: number, userId: string, search?: string,
        categories?: string[], dietaryRestrictions?: string[]
    ): Promise<FeedResponseDTO> {
        const { recipes, total } = await recipeRepository.findAll(
            page, limit, userId, search, categories, dietaryRestrictions
        )
        const totalPages = Math.ceil(total / limit)

        return {
            recipes: recipes.map(recipe => ({
                ...formatRecipe(recipe),
                author: {
                    id: recipe.author.id,
                    name: recipe.author.name,
                    avatarUrl: recipe.author.avatarUrl ?? null,
                },
            })) as FeedRecipe[],
            total,
            page,
            totalPages,
            hasNextPage: page < totalPages,
        }
    },

    async update(id: string, userId: string, data: Partial<CreateRecipeDTO>, photoBuffers?: Buffer[]): Promise<RecipeResponseDTO> {
        const recipe = await recipeRepository.findById(id)
        if (!recipe) throw new Error('Receita não encontrada')
        if (recipe.authorId !== userId) throw new Error('Sem permissão para editar esta receita')

        const updateData = { ...data }

        if (photoBuffers && photoBuffers.length > 0) {
            updateData.photos = await Promise.all(
                photoBuffers.map((buffer, i) =>
                    uploadService.uploadRecipePhoto(buffer, `recipe-${id}-${i}`)
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

    async share(id: string): Promise<string> {
        const recipe = await recipeRepository.findById(id)
        if (!recipe) throw new Error('Receita não encontrada')

        const photo = recipe.photos?.[0] ?? ''
        const apkUrl = process.env.APK_URL ?? 'https://expo.dev/accounts/abeatrizdscoelho/projects/fast-recipe'
        const deepLink = `fastrecipe://recipe/${id}`

        return `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta property="og:title" content="${recipe.title}"/>
    <meta property="og:description" content="${recipe.description ?? 'Veja essa receita incrível!'}"/>
    ${photo ? `<meta property="og:image" content="${photo}"/>` : ''}
    <title>${recipe.title} — Fast Recipe</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #7A0000; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .card { background: white; border-radius: 24px; max-width: 420px; width: 100%; overflow: hidden; }
        .photo { width: 100%; height: 240px; object-fit: cover; }
        .photo-placeholder { width: 100%; height: 180px; background: #f5ece8; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 48px; }
        .content { padding: 24px; }
        .title { font-size: 22px; font-weight: bold; color: #7A0000; margin-bottom: 8px; }
        .description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 16px; }
        .meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .chip { background: #f5ece8; border-radius: 50px; padding: 6px 14px; font-size: 12px; color: #7A0000; font-weight: 600; }
        .btn { display: block; background: #7A0000; color: white; text-align: center; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; }
        .footer { text-align: center; color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 16px; }
    </style>
    </head>
    <body>
    <div>
        <div class="card">
        ${photo ? `<img class="photo" src="${photo}" alt="${recipe.title}"/>` : '<div class="photo-placeholder">🍽️</div>'}
        <div class="content">
            <div class="title">${recipe.title}</div>
            ${recipe.description ? `<div class="description">${recipe.description}</div>` : ''}
            <div class="meta">
            <span class="chip">⏱ ${recipe.time} min</span>
            <span class="chip">👥 ${recipe.portions} porções</span>
            ${recipe.difficulty ? `<span class="chip">🔥 ${recipe.difficulty}</span>` : ''}
            </div>
            <a class="btn" href="${apkUrl}" id="download-btn">Baixar o Fast Recipe</a>
        </div>
        </div>
        <div class="footer">Fast Recipe — Compartilhe receitas incríveis</div>
    </div>

    <script>
    (function () {
        const deepLink = "${deepLink}";
        const fallbackUrl = "${apkUrl}";

        window.location.href = deepLink;

        const fallbackTimer = setTimeout(function () {
        window.location.href = fallbackUrl;
        }, 1500);

        window.addEventListener('blur', function () {
        clearTimeout(fallbackTimer);
        });

        document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearTimeout(fallbackTimer);
        }
        });
    })();
    </script>
    </body>
    </html>`
    },
}