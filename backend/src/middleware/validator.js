import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const otpVerifyRules = [
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Valid mobile number is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP is required')
];

// Product validation rules
export const createProductRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required')
];

export const updateProductRules = [
  param('id').isMongoId().withMessage('Valid product ID is required')
];

// Order validation rules
export const createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.mobile').matches(/^[0-9]{10}$/).withMessage('Valid mobile is required'),
  body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').matches(/^[0-9]{6}$/).withMessage('Valid pincode is required'),
  body('paymentMethod').isIn(['cod', 'card', 'upi', 'wallet']).withMessage('Valid payment method is required')
];

// Coupon validation rules
export const createCouponRules = [
  body('code').trim().notEmpty().withMessage('Coupon code is required').toUpperCase(),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Valid discount type is required'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Valid discount value is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
];

// Ticket validation rules
export const createTicketRules = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('category').isIn(['order', 'product', 'payment', 'shipping', 'return', 'other']).withMessage('Valid category is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

export const mongoIdRule = param('id').isMongoId().withMessage('Valid ID is required');
