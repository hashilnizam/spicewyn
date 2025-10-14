import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import { createBackup } from '../utils/backup.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Total revenue
    const revenueStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const revenue = revenueStats[0] || { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 };

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          slug: '$product.slug',
          image: { $arrayElemAt: ['$product.images.url', 0] },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    // Customer stats
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startDate }
    });

    // Stock alerts
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    // Revenue trend (daily)
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        revenue: {
          total: revenue.totalRevenue,
          orderCount: revenue.orderCount,
          averageOrderValue: revenue.averageOrderValue
        },
        ordersByStatus,
        topProducts,
        customers: {
          total: totalCustomers,
          new: newCustomers
        },
        stockAlerts: {
          lowStock: lowStockCount,
          outOfStock: outOfStockCount
        },
        revenueTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password -refreshToken -otpCode -otpExpires')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Only super_admin can create other admins
    if (['admin', 'super_admin'].includes(role) && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can assign admin roles'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const { category, isPublic } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isPublic) filter.isPublic = true;

    const settings = await Settings.find(filter);

    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    res.json({
      success: true,
      data: settingsMap
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const setting = await Settings.findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      results.push(setting);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: results
    });
  } catch (error) {
    next(error);
  }
};

export const manualBackup = async (req, res, next) => {
  try {
    const backupLog = await createBackup(req.user._id);

    res.json({
      success: true,
      message: 'Backup completed successfully',
      data: backupLog
    });
  } catch (error) {
    next(error);
  }
};

export const getBackupLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const BackupLog = (await import('../models/BackupLog.js')).default;
    
    const total = await BackupLog.countDocuments();
    const skip = (page - 1) * limit;

    const logs = await BackupLog.find()
      .populate('triggeredBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const searchGlobal = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const [products, orders, users] = await Promise.all([
      Product.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { sku: { $regex: q, $options: 'i' } }
        ]
      }).limit(5).select('name slug sku images'),
      
      Order.find({
        $or: [
          { orderNumber: { $regex: q, $options: 'i' } },
          { trackingNumber: { $regex: q, $options: 'i' } }
        ]
      }).limit(5).select('orderNumber orderStatus total createdAt'),
      
      User.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { mobile: { $regex: q, $options: 'i' } }
        ]
      }).limit(5).select('name email mobile role')
    ]);

    res.json({
      success: true,
      data: {
        products,
        orders,
        users
      }
    });
  } catch (error) {
    next(error);
  }
};
