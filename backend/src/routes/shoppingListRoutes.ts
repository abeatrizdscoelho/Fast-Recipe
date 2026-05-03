import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { shoppingListController } from '../controllers/shoppingListController'

const router = Router()

router.get('/', authMiddleware, shoppingListController.getShoppingList)
router.patch('/bought', authMiddleware, shoppingListController.toggleBought)

export default router