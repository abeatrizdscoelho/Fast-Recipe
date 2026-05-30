import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { statsController } from '../controllers/statsController'

const router = Router()

router.get('/', authMiddleware, statsController.getStats)
router.post('/cooked/:recipeId', authMiddleware, statsController.registerCooked)

export default router