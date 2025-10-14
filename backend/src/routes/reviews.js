import express from 'express';
import {
  createReview,
  getProductReviews,
  approveReview,
  deleteReview,
  respondToReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id/approve', protect, authorize('admin', 'super_admin', 'staff'), approveReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/respond', protect, authorize('admin', 'super_admin', 'staff'), respondToReview);

export default router;
