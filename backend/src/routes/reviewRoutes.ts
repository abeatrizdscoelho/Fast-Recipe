import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { reviewController } from '../controllers/reviewController'
import { reportController } from '../controllers/reportController'

const router = Router()

router.post('/:recipeId/reviews', authMiddleware, reviewController.upsertReview)
router.get('/:recipeId/reviews', authMiddleware, reviewController.getRating)
router.post('/:recipeId/comments', authMiddleware, reviewController.createComment)
router.get('/:recipeId/comments', authMiddleware, reviewController.getComments)
router.put('/comments/:commentId', authMiddleware, reviewController.updateComment)
router.delete('/comments/:commentId', authMiddleware, reviewController.deleteComment)
router.post('/comments/:commentId/report', authMiddleware, reportController.reportComment)

export default router