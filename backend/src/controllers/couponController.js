import Coupon from '../models/Coupon.js';

export const getCoupons = async (req, res, next) => {
  try {
    const { isActive, code } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (code) filter.code = code.toUpperCase();

    const coupons = await Coupon.find(filter)
      .populate('applicableProducts', 'name slug')
      .populate('applicableCategories', 'name slug')
      .sort('-createdAt');

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal, productIds } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is expired or inactive'
      });
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ₹${coupon.minPurchaseAmount}`
      });
    }

    // Check user segment
    if (coupon.userSegment !== 'all') {
      // Logic for user segment validation
    }

    // Check applicable products
    if (coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some(id => 
        coupon.applicableProducts.includes(id)
      );
      if (!hasApplicableProduct) {
        return res.status(400).json({
          success: false,
          message: 'Coupon not applicable to cart items'
        });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: {
        code: coupon.code,
        discountAmount: Math.min(discount, cartTotal),
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
