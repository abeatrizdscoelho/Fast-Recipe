export interface ShoppingListItemDTO {
    ingredientIds: string[]
    name: string
    quantity: number
    unit: string
    category: string
    bought: boolean
}

export interface ShoppingListDTO {
    weekStart: string
    totalRecipes: number
    items: ShoppingListItemDTO[]
    categories: string[] 
}

export interface ShoppingListResponseDTO {
    shoppingList: ShoppingListDTO | null
    message?: string 
}

export interface ToggleBoughtDTO {
    ingredientIds: string[]
    bought: boolean
}