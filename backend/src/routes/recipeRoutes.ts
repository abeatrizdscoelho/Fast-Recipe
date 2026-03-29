import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/authMiddleware'
import { recipeController } from '../controllers/recipeController'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

router.post('/', authMiddleware, upload.array('photos', 5), recipeController.create)
router.get('/me', authMiddleware, recipeController.getMyRecipes)
router.get('/all', authMiddleware, recipeController.getAll)
router.get('/:id', authMiddleware, recipeController.getById)
router.put('/:id', authMiddleware, upload.array('photos', 5), recipeController.update)
router.delete('/:id', authMiddleware, recipeController.delete)

export default router