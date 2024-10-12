import express from 'express'
import { body } from 'express-validator'
import reviewController from '../controllers/review.controller.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import requestHandler from '../handlers/request.handler.js'

const router = express.Router({ mergeParams: true })

// Get reviews of the authenticated user
router.get('/', tokenMiddleware.auth, reviewController.getReviewsOfUser)

// Create a new review
router.post(
  '/',
  tokenMiddleware.auth,
  body('mediaId')
    .exists()
    .withMessage('mediaId is required')
    .isLength({ min: 1 })
    .withMessage('mediaId cannot be empty'),
  body('content')
    .exists()
    .withMessage('content is required')
    .isLength({ min: 1 })
    .withMessage('content cannot be empty'),
  body('mediaType')
    .exists()
    .withMessage('mediaType is required')
    .custom(type => ['movie', 'tv'].includes(type))
    .withMessage('Invalid mediaType'),
  body('mediaTitle').exists().withMessage('mediaTitle is required'),
  body('mediaPoster').exists().withMessage('mediaPoster is required'),
  body('mediaRate') // New validation for mediaRate
    .exists()
    .withMessage('mediaRate is required')
    .isNumeric()
    .withMessage('mediaRate must be a number'),
  requestHandler.validate,
  reviewController.create
)

// Delete a specific review by ID
router.delete('/:reviewId', tokenMiddleware.auth, reviewController.remove)

export default router
