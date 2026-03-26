export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface ForgotPasswordDTO {
  email: string
  confirmEmail: string
}

export interface ResetPasswordDTO {
  token: string
  password: string
  confirmPassword: string
}

export interface AuthResponseDTO {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface MessageResponseDTO {
  message: string
}