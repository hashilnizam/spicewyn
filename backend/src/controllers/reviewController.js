import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment, images, orderId } = req.body;

    // Check if user has purchased the product
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'items.product': product,
        orderStatus: 'delivered'
      });
      isVerifiedPurchase = !!order;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      product,
      user: req.user._id,
      order: orderId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase
    });

    // Update product rating
    await updateProductRating(product);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      product: productId,
      isApproved: true
    })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      product: productId,
      isApproved: true
    });

    res.json({
      success: true,
      data: reviews,
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

export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check authorization
    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const respondToReview = async (req, res, next) => {
  try {
    const { comment } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        response: {
          comment,
          respondedBy: req.user._id,
          respondedAt: new Date()
        }
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    {
      $match: {
        product: productId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const { averageRating = 0, count = 0 } = stats[0] || {};

  await Product.findByIdAndUpdate(productId, {
    'ratings.average': Math.round(averageRating * 10) / 10,
    'ratings.count': count
  });
}
