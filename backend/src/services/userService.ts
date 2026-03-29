import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/userRepository'
import { uploadService } from './uploadService'
import type { UpdateProfileDTO, UpdateProfileResponseDTO } from '../models/userDTO'

export const userService = {
  async getProfile(userId: string): Promise<UpdateProfileResponseDTO> {
    const user = await userRepository.findById(userId)
    if (!user) throw new Error('Usuário não encontrado')

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl ?? null,
        dietaryPreferences: user.dietaryPreferences ?? [],
      },
    }
  },

  async updateProfile(userId: string, data: UpdateProfileDTO, avatarBuffer?: Buffer): Promise<UpdateProfileResponseDTO> {
    const user = await userRepository.findById(userId)
    if (!user) throw new Error('Usuário não encontrado')

    // Verifica se o novo e-mail já está em uso por outro usuário
    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email)
      if (existing) throw new Error('E-mail já está em uso')
    }

    const updateData: {
      name?: string
      email?: string
      password?: string
      avatarUrl?: string
      dietaryPreferences?: string[]
    } = {}

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10)
    if (avatarBuffer) updateData.avatarUrl = await uploadService.uploadAvatar(avatarBuffer, userId)
    if (data.dietaryPreferences) updateData.dietaryPreferences = data.dietaryPreferences  

    const updated = await userRepository.updateProfile(userId, updateData)

    return {
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl ?? null,
        dietaryPreferences: updated.dietaryPreferences ?? [],
      },
    }
  },
}