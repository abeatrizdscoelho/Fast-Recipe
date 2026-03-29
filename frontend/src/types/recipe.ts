export type RecipeFormData = {
  title: string
  time: string
  ingredients: string[]
  preparation: string
  portions: string
  category: string
  photos: string[]
  difficulty: string   
  description: string  
}

export type Recipe = {
  id: string
  title: string
  time: string
  ingredients: string[]
  preparation: string
  portions: string
  category: string
  photo: string | null     
  photoUrl: string | null 
  photos: string[] 
  favorite: boolean
  difficulty: string | null
  description: string | null
  authorId: string
  createdAt: string
}