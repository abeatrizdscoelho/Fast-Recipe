export type ReviewDTO = {
  id: string
  rating: number
  userId: string
  recipeId: string
  createdAt: string
  updatedAt: string
}

export type CommentDTO = {
  id: string
  text: string
  userId: string
  recipeId: string
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
  createdAt: string
  updatedAt: string
  isEdited: boolean
  isOwner: boolean
}

export type RecipeRatingDTO = {
  average: number        
  count: number       
  userRating: number | null  
}

export type ReviewResponseDTO = {
  review: ReviewDTO
  average: number
  count: number
}

export type CommentResponseDTO = {
  comment: CommentDTO
}

export type CommentsListDTO = {
  comments: CommentDTO[]
}