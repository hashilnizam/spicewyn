import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
  getLowStockProducts,
  getExpiredProducts
} from '../controllers/productController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate, createProductRules, updateProductRules } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/:slug', optionalAuth, getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), createProductRules, validate, createProduct);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateProductRules, validate, updateProduct);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteProduct);
router.post('/bulk-import', protect, authorize('admin', 'super_admin'), bulkImportProducts);
router.get('/alerts/low-stock', protect, authorize('admin', 'super_admin', 'staff'), getLowStockProducts);
router.get('/alerts/expired', protect, authorize('admin', 'super_admin', 'staff'), getExpiredProducts);

export default router;
