export interface UpdateProfileDTO {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface UpdateProfileResponseDTO {
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}