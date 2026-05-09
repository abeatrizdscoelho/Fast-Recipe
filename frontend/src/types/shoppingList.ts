export interface ShoppingListItem {
  ingredientIds: string[]
  name: string
  quantity: number
  unit: string
  category: string
  bought: boolean
}

export interface ShoppingList {
  weekStart: string
  totalRecipes: number
  items: ShoppingListItem[]
  categories: string[]
}

export interface ShoppingListResponse {
  shoppingList: ShoppingList | null
  message?: string
}

export interface ToggleBoughtPayload {
  ingredientIds: string[]
  bought: boolean
}

export interface AddItemPayload {
  name: string
  quantity: number
  unit: string
  category: string
}

export interface UpdateItemPayload {
  ingredientIds: string[]
  name: string
  quantity: number
  unit: string
  category: string
}

export interface DeleteItemPayload {
  ingredientIds: string[]
}

export type ItemModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; item: ShoppingListItem }