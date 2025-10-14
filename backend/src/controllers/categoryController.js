import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const { parent, includeInactive } = req.query;

    const filter = {};
    if (parent) {
      filter.parent = parent === 'null' ? null : parent;
    }
    if (!includeInactive) {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate('parent', 'name slug')
      .sort('order name');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: category._id, isActive: true });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has subcategories
    const hasSubcategories = await Category.countDocuments({ parent: category._id });
    if (hasSubcategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
