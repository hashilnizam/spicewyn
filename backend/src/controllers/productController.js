import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { generatePagination, generateStructuredData } from '../utils/helpers.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      minPrice,
      maxPrice,
      tags,
      search,
      sort = '-createdAt',
      isFeatured,
      isBestseller,
      isNewArrival
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isBestseller === 'true') filter.isBestseller = true;
    if (isNewArrival === 'true') filter.isNewArrival = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(filter);
    const pagination = generatePagination(page, limit, total);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .select('-structuredData');

    res.json({
      success: true,
      data: products,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: '-createdAt', limit: 10 }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    // Track recently viewed for authenticated users
    if (req.user) {
      await req.user.updateOne({
        $pull: { recentlyViewed: { product: product._id } }
      });
      await req.user.updateOne({
        $push: {
          recentlyViewed: {
            $each: [{ product: product._id, viewedAt: new Date() }],
            $position: 0,
            $slice: 20
          }
        }
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ],
      isActive: true
    })
      .limit(8)
      .select('name slug price compareAtPrice images ratings');

    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    // Generate structured data
    product.structuredData = generateStructuredData(product);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update structured data
    product.structuredData = generateStructuredData(product);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const bulkImportProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    const importedProducts = await Product.insertMany(products, { ordered: false });

    res.json({
      success: true,
      message: `${importedProducts.length} products imported successfully`,
      data: { count: importedProducts.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true
    })
      .select('name sku stock lowStockThreshold category')
      .populate('category', 'name')
      .sort('stock');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiredProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      expiryDate: { $lt: new Date() },
      isActive: true
    })
      .select('name sku expiryDate category')
      .populate('category', 'name')
      .sort('expiryDate');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
