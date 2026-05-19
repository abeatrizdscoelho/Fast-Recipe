import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { pantryController } from '../controllers/pantryController'

const router = Router()

router.get('/', authMiddleware, pantryController.getItems)
router.post('/', authMiddleware, pantryController.addItem)
router.put('/:id', authMiddleware, pantryController.updateItem)
router.delete('/:id', authMiddleware, pantryController.deleteItem)
router.get('/suggestions', authMiddleware, pantryController.getSuggestions)

export default router