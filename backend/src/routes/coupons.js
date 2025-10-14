import express from 'express';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate, createCouponRules } from '../middleware/validator.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'super_admin', 'staff'), getCoupons);
router.post('/validate', optionalAuth, validateCoupon);
router.post('/', protect, authorize('admin', 'super_admin'), createCouponRules, validate, createCoupon);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCoupon);

export default router;
