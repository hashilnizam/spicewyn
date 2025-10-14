import User from '../models/User.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isActive: true },
      select: 'name slug price compareAtPrice images stock ratings'
    });

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlistCount: user.wishlist.length }
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlistCount: user.wishlist.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed.product',
      match: { isActive: true },
      select: 'name slug price compareAtPrice images ratings'
    });

    const recentlyViewed = user.recentlyViewed
      .filter(item => item.product) // Filter out deleted products
      .slice(0, 20);

    res.json({
      success: true,
      data: recentlyViewed
    });
  } catch (error) {
    next(error);
  }
};
