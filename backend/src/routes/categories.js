import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), createCategory);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCategory);

export default router;
