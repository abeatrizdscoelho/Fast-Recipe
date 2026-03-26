import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  id: string
}

export interface AuthRequest extends Request {
  userId?: string
}

const JWT_SECRET = process.env.JWT_SECRET as string
if (!JWT_SECRET) throw new Error('JWT_SECRET não definido.')

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload
    req.userId = decoded.id
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}