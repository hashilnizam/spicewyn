import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  trackBannerClick
} from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/:id/track-click', trackBannerClick);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), createBanner);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateBanner);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteBanner);

export default router;
