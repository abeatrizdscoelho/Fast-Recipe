import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { favoriteController } from '../controllers/favoriteController'

const router = Router()

router.get('/', authMiddleware, favoriteController.getFavorites)
router.post('/:recipeId/toggle', authMiddleware, favoriteController.toggle)

export default router