import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/authMiddleware'
import { userController } from '../controllers/userController'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Formato de imagem inválido. Use JPEG, PNG ou WEBP.'))
    }
  },
})

const router = Router()

router.get('/', authMiddleware, userController.getProfile)
router.put('/', authMiddleware, upload.single('avatar'), userController.updateProfile)

export default router