import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getRecentlyViewed
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/recently-viewed', getRecentlyViewed);

export default router;
