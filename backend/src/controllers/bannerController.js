import Banner from '../models/Banner.js';

export const getBanners = async (req, res, next) => {
  try {
    const { placement, isActive } = req.query;

    const filter = {};
    if (placement) filter.placement = placement;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Check if banner is within date range
    const now = new Date();
    filter.startDate = { $lte: now };
    filter.$or = [
      { endDate: { $gte: now } },
      { endDate: null }
    ];

    const banners = await Banner.find(filter).sort('order -createdAt');

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const trackBannerClick = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      data: { clickCount: banner.clickCount }
    });
  } catch (error) {
    next(error);
  }
};
