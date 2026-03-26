import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository } from '../repositories/userRepository';
import type { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, MessageResponseDTO, AuthResponseDTO } 
from '../models/authDTO';
import { emailService } from './emailService';

const JWT_EXPIRES_IN = '7d'
const JWT_SECRET = process.env.JWT_SECRET as string
if (!JWT_SECRET) throw new Error('JWT_SECRET não definido.')

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) throw new Error('E-mail já cadastrado')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await userRepository.create({ ...data, password: hashedPassword })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return { token, user: { id: user.id, name: user.name, email: user.email } }
  },

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await userRepository.findByEmail(data.email)
    if (!user) throw new Error('E-mail ou senha inválidos')

    const validPassword = await bcrypt.compare(data.password, user.password)
    if (!validPassword) throw new Error('E-mail ou senha inválidos')

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return { token, user: { id: user.id, name: user.name, email: user.email } }
  },

  async forgotPassword(data: ForgotPasswordDTO): Promise<void> {
    const user = await userRepository.findByEmail(data.email)
    if (!user) throw new Error('E-mail não encontrado')

    const token = crypto.randomBytes(32).toString('hex') // Token temporário 
    const expires = new Date(Date.now() + 1000 * 60 * 60)

    await userRepository.updateResetToken(user.id, token, expires)
    await emailService.sendPasswordReset(user.email, user.name, token)
  },

  async resetPassword(data: ResetPasswordDTO): Promise<MessageResponseDTO> {
    const user = await userRepository.findByResetToken(data.token)
    if (!user) throw new Error('Token inválido ou expirado')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    await userRepository.updatePassword(user.id, hashedPassword)
    return { message: 'Senha redefinida com sucesso' }
  },
}