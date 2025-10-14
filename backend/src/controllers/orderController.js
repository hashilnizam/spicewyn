import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import LoyaltyTransaction from '../models/LoyaltyTransaction.js';
import { sendOrderConfirmation } from '../utils/email.js';
import { generatePagination, calculateLoyaltyPoints } from '../utils/helpers.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      useLoyaltyPoints
    } = req.body;

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        sku: product.sku,
        variant: item.variant,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    // Apply discount if coupon provided
    let discount = 0;
    // Coupon logic would be here

    // Calculate shipping and tax
    const shippingCost = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const tax = subtotal * 0.05; // 5% tax

    // Apply loyalty points
    let loyaltyPointsUsed = 0;
    if (useLoyaltyPoints && req.user.loyaltyPoints > 0) {
      loyaltyPointsUsed = Math.min(req.user.loyaltyPoints, Math.floor(subtotal * 0.1)); // Max 10% discount
    }

    const total = subtotal - discount - loyaltyPointsUsed + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      discount,
      couponCode,
      shippingCost,
      tax,
      total,
      paymentMethod,
      loyaltyPointsUsed,
      loyaltyPointsEarned: calculateLoyaltyPoints(total)
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSales: item.quantity }
      });
    }

    // Update user loyalty points
    if (loyaltyPointsUsed > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: -loyaltyPointsUsed }
      });

      await LoyaltyTransaction.create({
        user: req.user._id,
        type: 'redeemed',
        points: -loyaltyPointsUsed,
        description: `Redeemed for order ${order.orderNumber}`,
        order: order._id,
        balanceAfter: req.user.loyaltyPoints - loyaltyPointsUsed
      });
    }

    // Add loyalty points earned
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: order.loyaltyPointsEarned }
    });

    await LoyaltyTransaction.create({
      user: req.user._id,
      type: 'earned',
      points: order.loyaltyPointsEarned,
      description: `Earned from order ${order.orderNumber}`,
      order: order._id,
      balanceAfter: req.user.loyaltyPoints + order.loyaltyPointsEarned
    });

    // Send confirmation email
    await sendOrderConfirmation(req.user.email, order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const pagination = generatePagination(page, limit, total);

    const orders = await Order.find(filter)
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .select('-statusHistory');

    res.json({
      success: true,
      data: orders,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name slug')
      .populate('user', 'name email mobile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && 
        !['admin', 'super_admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Order.countDocuments(filter);
    const pagination = generatePagination(page, limit, total);

    const orders = await Order.find(filter)
      .populate('user', 'name email mobile')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .select('-statusHistory');

    res.json({
      success: true,
      data: orders,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    
    order.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id,
      updatedAt: new Date()
    });

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      note: reason,
      updatedBy: req.user._id,
      updatedAt: new Date()
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, totalSales: -item.quantity }
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
