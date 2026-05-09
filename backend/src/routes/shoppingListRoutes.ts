import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { shoppingListController } from '../controllers/shoppingListController'

const router = Router()

router.get('/', authMiddleware, shoppingListController.getShoppingList)
router.patch('/bought', authMiddleware, shoppingListController.toggleBought)
router.post('/items', authMiddleware, shoppingListController.addItem)
router.patch('/items', authMiddleware, shoppingListController.updateItem)
router.delete('/items', authMiddleware, shoppingListController.deleteItem)

export default router