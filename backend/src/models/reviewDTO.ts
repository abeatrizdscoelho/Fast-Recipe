export interface ReviewDTO {
  id: string
  rating: number
  userId: string
  recipeId: string
  createdAt: string
  updatedAt: string
}

export interface CommentDTO {
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
  isOwner?: boolean  
}

export interface RecipeRatingDTO {
  average: number       
  count: number         
  userRating: number | null  
}

export interface ReviewResponseDTO {
  review: ReviewDTO
  average: number
  count: number
}

export interface CommentResponseDTO {
  comment: CommentDTO
}

export interface CommentsListDTO {
  comments: CommentDTO[]
}