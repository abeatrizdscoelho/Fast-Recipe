import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { mealPlanController } from '../controllers/mealPlanController'

const router = Router()

router.get('/', authMiddleware, mealPlanController.getWeekPlan)
router.post('/entries', authMiddleware, mealPlanController.addEntry)
router.put('/entries/:entryId', authMiddleware, mealPlanController.replaceEntry)
router.delete('/entries/:entryId', authMiddleware, mealPlanController.removeEntry)
router.patch('/entries/:entryId/completed', authMiddleware, mealPlanController.toggleCompleted)

export default router