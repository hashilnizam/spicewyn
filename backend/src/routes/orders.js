import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, createOrderRules } from '../middleware/validator.js';

const router = express.Router();

// Customer routes
router.post('/', protect, createOrderRules, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin', 'super_admin', 'staff'), getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'super_admin', 'staff'), updateOrderStatus);

export default router;
